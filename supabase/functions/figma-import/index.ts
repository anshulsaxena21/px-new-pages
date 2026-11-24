import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const FIGMA_API = "https://api.figma.com/v1";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json"
};

function reply(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}
function cleanNode(node: any): any {
  const keep = [
    "id","name","type","visible","locked","opacity","blendMode","rotation",
    "absoluteBoundingBox","absoluteRenderBounds","relativeTransform","size",
    "children","fills","strokes","strokeWeight","strokeAlign","effects",
    "cornerRadius","rectangleCornerRadii","clipsContent","layoutMode",
    "layoutWrap","primaryAxisSizingMode","counterAxisSizingMode",
    "primaryAxisAlignItems","counterAxisAlignItems","itemSpacing",
    "counterAxisSpacing","paddingLeft","paddingRight","paddingTop","paddingBottom",
    "layoutAlign","layoutGrow","constraints","characters","style","characterStyleOverrides",
    "componentId","componentProperties","exportSettings","arcData","isMask"
  ];
  const out: Record<string, unknown> = {};
  for (const key of keep) {
    if (node[key] !== undefined) out[key] = key === "children" ? (node.children || []).map(cleanNode) : node[key];
  }
  return out;
}
function flatten(nodes: any[], out: any[] = []): any[] {
  for (const node of nodes || []) {
    out.push(node);
    if (node.children) flatten(node.children, out);
  }
  return out;
}

function describeLayers(root: any, assets: any[] = []) {
  const assetMap = new Map(assets.map(a => [a.nodeId, a.name]));
  const rows: any[] = [];
  const visit = (node: any, parents: string[] = []) => {
    const b = node.absoluteBoundingBox || {}, st = node.style || {};
    const paint = (items: any[] = []) => items.filter(p => p.visible !== false).map(p => p.type === "SOLID" && p.color
      ? "#" + [p.color.r,p.color.g,p.color.b].map((v:number)=>Math.round(v*255).toString(16).padStart(2,"0")).join("").toUpperCase()
      : p.type);
    rows.push({
      id:node.id,name:node.name||"Untitled",type:node.type,parent:parents.at(-1)||null,
      hierarchy:[...parents,node.name||"Untitled"].join(" / "),
      position:{x:b.x??null,y:b.y??null,width:b.width??null,height:b.height??null,rotation:node.rotation??0},
      layout:{mode:node.layoutMode||"NONE",itemGap:node.itemSpacing??null,counterAxisSpacing:node.counterAxisSpacing??null,padding:{top:node.paddingTop??0,right:node.paddingRight??0,bottom:node.paddingBottom??0,left:node.paddingLeft??0},primaryAxisAlign:node.primaryAxisAlignItems||null,counterAxisAlign:node.counterAxisAlignItems||null},
      typography:node.type==="TEXT"?{content:node.characters||"",fontFamily:st.fontFamily||null,fontStyle:st.fontPostScriptName||null,fontWeight:st.fontWeight??null,fontSize:st.fontSize??null,lineHeight:st.lineHeightPx??st.lineHeightPercent??null,letterSpacing:st.letterSpacing??null,textAlign:st.textAlignHorizontal||null}:null,
      appearance:{fills:paint(node.fills||[]),strokes:paint(node.strokes||[]),strokeWeight:node.strokeWeight??null,opacity:node.opacity??1,cornerRadius:node.cornerRadius??null,effects:node.effects||[],blendMode:node.blendMode||null,clipsContent:!!node.clipsContent},
      text:node.characters||null,asset:assetMap.get(node.id)||null
    });
    (node.children||[]).forEach((child:any)=>visit(child,[...parents,node.name||"Untitled"]));
  };
  visit(root); return rows;
}

function safeFileKey(value: unknown) {
  const key = String(value || "").trim();
  if (!/^[A-Za-z0-9]{10,80}$/.test(key)) throw new Error("Invalid Figma file key.");
  return key;
}
function getSupabaseSecret() {
  const raw = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (raw) {
    const keys = JSON.parse(raw);
    const key = keys.default || Object.values(keys)[0];
    if (typeof key === "string") return key;
  }
  const legacy = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (legacy) return legacy;
  throw new Error("Supabase server secret is not configured.");
}
function storageHeaders(key: string, contentType?: string) {
  const headers = new Headers({ apikey: key });
  if (!key.startsWith("sb_secret_")) headers.set("Authorization", `Bearer ${key}`);
  if (contentType) headers.set("Content-Type", contentType);
  return headers;
}

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (request.method !== "POST") return reply({ message: "Use POST to import a Figma file." }, 405);

  try {
    const suppliedKey = request.headers.get("apikey") || "";
    const publishableRaw = Deno.env.get("SUPABASE_PUBLISHABLE_KEYS");
    const publishableKeys = publishableRaw ? Object.values(JSON.parse(publishableRaw)) : [];
    const allowedKeys = [...publishableKeys, Deno.env.get("SUPABASE_ANON_KEY")].filter(Boolean);
    if (!allowedKeys.includes(suppliedKey)) return reply({ message: "Supabase client key was not accepted." }, 401);

    const body = await request.json();
    const fileKey = safeFileKey(body.fileKey);
    const figmaToken = String(body.figmaToken || "").trim();
    const nodeId = body.nodeId ? String(body.nodeId).replace(/-/g, ":") : "";
    if (!figmaToken || figmaToken.length < 20 || figmaToken.length > 500) {
      return reply({ message: "A valid Figma personal access token is required." }, 400);
    }

    const figmaHeaders = { "X-Figma-Token": figmaToken };
    const endpoint = nodeId
      ? `${FIGMA_API}/files/${fileKey}/nodes?ids=${encodeURIComponent(nodeId)}`
      : `${FIGMA_API}/files/${fileKey}?geometry=paths`;
    const fileResponse = await fetch(endpoint, { headers: figmaHeaders });
    const filePayload = await fileResponse.json().catch(() => ({}));
    if (!fileResponse.ok) {
      const message = fileResponse.status === 403
        ? "Figma denied access. Check your token's file content read permission and access to this file."
        : fileResponse.status === 404
          ? "Figma file or selected node was not found. Check the URL and file permissions."
          : fileResponse.status === 429
            ? "Figma rate limit reached. Wait a little and try again."
            : String(filePayload.err || filePayload.message || "Figma could not return this design.");
      return reply({ message, figmaStatus: fileResponse.status }, fileResponse.status === 429 ? 429 : 400);
    }

    const fileName = filePayload.name || "Figma design";
    const lastModified = filePayload.lastModified || null;
    let document: any;
    if (nodeId) {
      const selectedNode = filePayload.nodes?.[nodeId];
      if (!selectedNode?.document) return reply({ message: "The selected Figma frame could not be found." }, 404);
      document = selectedNode.document;
    } else {
      document = filePayload.document;
    }
    if (!document) return reply({ message: "Figma returned an empty document." }, 422);

    const nodes = flatten([document]);
    const imageNodeIds = nodes.filter(n => (n.fills || []).some((fill: any) => fill.type === "IMAGE")).map(n => n.id);
    const vectorNodeIds = nodes.filter(n => ["VECTOR","BOOLEAN_OPERATION"].includes(n.type)).map(n => n.id);
    const assetIds = [...new Set([...imageNodeIds, ...vectorNodeIds])].slice(0, 180);
    let imageMap: Record<string, string> = {};
    for (const batch of [
      { ids: imageNodeIds.slice(0, 100), format: "png", scale: 2 },
      { ids: vectorNodeIds.slice(0, 100), format: "svg", scale: 1 }
    ]) {
      if (!batch.ids.length) continue;
      const params = new URLSearchParams({ ids: batch.ids.join(","), format: batch.format, scale: String(batch.scale) });
      const response = await fetch(`${FIGMA_API}/images/${fileKey}?${params}`, { headers: figmaHeaders });
      if (response.ok) {
        const payload = await response.json();
        imageMap = { ...imageMap, ...(payload.images || {}) };
      }
    }

    const renderAssets = assetIds.map(id => {
      const node = nodes.find(n => n.id === id);
      const url = imageMap[id];
      if (!url) return null;
      const format = imageNodeIds.includes(id) ? "png" : "svg";
      const safeName = String(node?.name || "asset").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
      return { nodeId: id, name: `${safeName || "asset"}-${id.replace(/:/g, "-")}.${format}`, format, sourceUrl: url };
    }).filter(Boolean);

    const serviceKey = getSupabaseSecret();
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    if (!supabaseUrl) throw new Error("SUPABASE_URL is not configured.");
    const storedAssets: any[] = [];
    for (let i = 0; i < renderAssets.length; i += 6) {
      const batch = renderAssets.slice(i, i + 6);
      const results = await Promise.all(batch.map(async (asset: any) => {
        try {
          const download = await fetch(asset.sourceUrl);
          if (!download.ok) throw new Error("Figma asset download failed.");
          const bytes = await download.arrayBuffer();
          const mime = asset.format === "svg" ? "image/svg+xml" : "image/png";
          const path = `${fileKey}/${asset.name}`;
          const encoded = path.split("/").map(encodeURIComponent).join("/");
          const upload = await fetch(`${supabaseUrl}/storage/v1/object/figma-assets/${encoded}`, {
            method: "POST",
            headers: storageHeaders(serviceKey, mime),
            body: bytes
          });
          if (!upload.ok) throw new Error("Storage upload failed: " + (await upload.text()).slice(0, 150));
          const sign = await fetch(`${supabaseUrl}/storage/v1/object/sign/figma-assets/${encoded}`, {
            method: "POST",
            headers: storageHeaders(serviceKey, "application/json"),
            body: JSON.stringify({ expiresIn: 604800 })
          });
          const signed = await sign.json().catch(() => ({}));
          if (!sign.ok || !signed.signedURL) throw new Error("Could not create signed asset URL.");
          const signedUrl = signed.signedURL.startsWith("http") ? signed.signedURL : supabaseUrl + "/storage/v1" + signed.signedURL;
          return { nodeId: asset.nodeId, name: asset.name, format: asset.format, path, url: signedUrl, stored: true };
        } catch (error) {
          console.error("Asset persistence failed", asset.nodeId, error instanceof Error ? error.message : error);
          return { nodeId: asset.nodeId, name: asset.name, format: asset.format, url: asset.sourceUrl, stored: false };
        }
      }));
      storedAssets.push(...results);
    }

    const stats = {
      layers: nodes.length,
      text: nodes.filter(n => n.type === "TEXT").length,
      images: imageNodeIds.length,
      vectors: vectorNodeIds.length
    };
    const saveResponse = await fetch(`${supabaseUrl}/rest/v1/figma_imports`, {
      method: "POST",
      headers: {
        ...Object.fromEntries(storageHeaders(serviceKey, "application/json")),
        "Prefer": "return=representation"
      },
      body: JSON.stringify({
        file_key: fileKey,
        file_name: fileName,
        node_id: nodeId || null,
        version: filePayload.version || null,
        last_modified: lastModified,
        design_data: cleanNode(document),
        layer_descriptions: describeLayers(document, storedAssets),
        assets: storedAssets,
        stats
      })
    });
    if (!saveResponse.ok) {
      console.error("Figma snapshot save failed", saveResponse.status, (await saveResponse.text()).slice(0, 300));
      throw new Error("The design was read, but its snapshot could not be saved to Supabase.");
    }
    const savedRows = await saveResponse.json();
    return reply({
      importId: Array.isArray(savedRows) ? savedRows[0]?.id || null : null,
      name: fileName,
      lastModified,
      version: filePayload.version || null,
      document: cleanNode(document),
      assets: storedAssets,
      stats
    });
  } catch (error) {
    console.error("figma-import error", error instanceof Error ? error.message : error);
    return reply({ message: error instanceof Error ? error.message : "Unexpected import error." }, 500);
  }
});