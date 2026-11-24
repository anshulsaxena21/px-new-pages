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
    if (node[key] !== undefined) {
      out[key] = key === "children" ? (node.children || []).map(cleanNode) : node[key];
    }
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
function safeFileKey(value: unknown) {
  const key = String(value || "").trim();
  if (!/^[A-Za-z0-9]{10,80}$/.test(key)) throw new Error("Invalid Figma file key.");
  return key;
}

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (request.method !== "POST") return reply({ message: "Use POST to import a Figma file." }, 405);

  try {
    const body = await request.json();
    const fileKey = safeFileKey(body.fileKey);
    const figmaToken = String(body.figmaToken || "").trim();
    const nodeId = body.nodeId ? String(body.nodeId).replace(/-/g, ":") : "";
    if (!figmaToken || figmaToken.length < 20 || figmaToken.length > 500) {
      return reply({ message: "A valid Figma personal access token is required." }, 400);
    }
    const headers = { "X-Figma-Token": figmaToken };
    const endpoint = nodeId
      ? `${FIGMA_API}/files/${fileKey}/nodes?ids=${encodeURIComponent(nodeId)}`
      : `${FIGMA_API}/files/${fileKey}?geometry=paths`;
    const fileResponse = await fetch(endpoint, { headers });
    const filePayload = await fileResponse.json().catch(() => ({}));
    if (!fileResponse.ok) {
      const message = fileResponse.status === 403
        ? "Figma denied access. Check that your token has file content read access and that you can open this file."
        : fileResponse.status === 404
          ? "Figma file or selected node was not found. Check the URL and your file permissions."
          : fileResponse.status === 429
            ? "Figma rate limit reached. Wait a little and try again."
            : String(filePayload.err || filePayload.message || "Figma could not return this design.");
      return reply({ message, figmaStatus: fileResponse.status }, fileResponse.status === 429 ? 429 : 400);
    }

    let document: any;
    let fileName = filePayload.name || "Figma design";
    let lastModified = filePayload.lastModified || null;
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
    let assetMap: Record<string, string> = {};
    if (assetIds.length) {
      const formats = [
        { ids: imageNodeIds.slice(0, 100), format: "png", scale: 2 },
        { ids: vectorNodeIds.slice(0, 100), format: "svg", scale: 1 }
      ];
      for (const batch of formats) {
        if (!batch.ids.length) continue;
        const params = new URLSearchParams({ ids: batch.ids.join(","), format: batch.format, scale: String(batch.scale) });
        const imageResponse = await fetch(`${FIGMA_API}/images/${fileKey}?${params}`, { headers });
        if (imageResponse.ok) {
          const imagePayload = await imageResponse.json();
          assetMap = { ...assetMap, ...(imagePayload.images || {}) };
        }
      }
    }
    const assets = assetIds.map(id => {
      const node = nodes.find(n => n.id === id);
      const url = assetMap[id];
      if (!url) return null;
      const format = imageNodeIds.includes(id) ? "png" : "svg";
      const safeName = String(node?.name || "asset").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
      return { nodeId: id, name: `${safeName || "asset"}-${id.replace(/:/g,"-")}.${format}`, format, url };
    }).filter(Boolean);

    return reply({
      name: fileName,
      lastModified,
      version: filePayload.version || null,
      document: cleanNode(document),
      assets: finalAssets,
      stats: {
        layers: nodes.length,
        text: nodes.filter(n => n.type === "TEXT").length,
        images: imageNodeIds.length,
        vectors: vectorNodeIds.length
      }
    });
  } catch (error) {
    console.error("figma-import error", error instanceof Error ? error.message : error);
    return reply({ message: error instanceof Error ? error.message : "Unexpected import error." }, 500);
  }
});