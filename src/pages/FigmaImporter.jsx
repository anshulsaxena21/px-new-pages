import React, { useMemo, useState } from "react";
import { Activity, ArrowDownToLine, ArrowRight, Box, Check, ChevronDown, ChevronRight, CircleHelp, Code2, Copy, FileImage, FileJson, Figma, Frame, Image as ImageIcon, Layers3, Link2, LoaderCircle, LockKeyhole, Palette, Ruler, Search, Settings2, Sparkles, Type, X } from "lucide-react";

const PROJECT_URL = "https://ovdxipfxychotaspfccl.supabase.co";
const FUNCTION_URL = PROJECT_URL + "/functions/v1/figma-import";
const DEFAULT_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";

function parseFigmaUrl(value) {
  const url = new URL(value.trim());
  if (!/^(www\.)?figma\.com$/.test(url.hostname)) throw new Error("Paste a valid figma.com design or file URL.");
  const parts = url.pathname.split("/").filter(Boolean);
  const keyIndex = parts.findIndex((part) => part === "design" || part === "file");
  if (keyIndex < 0 || !parts[keyIndex + 1]) throw new Error("This link should point to a Figma design or file.");
  const fileKey = parts[keyIndex + 1];
  const nodeId = url.searchParams.get("node-id")?.replace(/-/g, ":") || null;
  return { fileKey, nodeId };
}

function walk(nodes, output = []) {
  for (const node of nodes || []) {
    output.push(node);
    if (node.children) walk(node.children, output);
  }
  return output;
}

function px(value) { return typeof value === "number" ? Math.round(value * 100) / 100 + "px" : "—"; }
function rgba(color, opacity = 1) {
  if (!color) return "—";
  const hex = [color.r, color.g, color.b].map((v) => Math.round(v * 255).toString(16).padStart(2, "0")).join("");
  return "#" + hex.toUpperCase() + (opacity < 1 ? " / " + Math.round(opacity * 100) + "%" : "");
}
function downloadText(name, content, type = "text/plain") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}
function cssTokens(nodes) {
  const colors = new Map(); const fonts = new Map(); const radii = new Set(); const spaces = new Set();
  nodes.forEach((n) => {
    (n.fills || []).filter((f) => f.type === "SOLID" && f.visible !== false).forEach((f) => colors.set(rgba(f.color, f.opacity ?? 1), true));
    if (n.style?.fontFamily) fonts.set(n.style.fontFamily, true);
    if (n.cornerRadius) radii.add(n.cornerRadius);
    [n.itemSpacing, n.paddingLeft, n.paddingRight, n.paddingTop, n.paddingBottom].forEach((v) => { if (typeof v === "number" && v > 0) spaces.add(v); });
  });
  let css = ":root {\n";
  [...colors.keys()].forEach((c, i) => css += `  --figma-color-${i + 1}: ${c};\n`);
  [...fonts.keys()].forEach((f, i) => css += `  --figma-font-${i + 1}: "${f}", sans-serif;\n`);
  [...[...radii].sort((a,b)=>a-b)].forEach((v,i) => css += `  --figma-radius-${i + 1}: ${v}px;\n`);
  [...[...spaces].sort((a,b)=>a-b)].forEach((v,i) => css += `  --figma-space-${i + 1}: ${v}px;\n`);
  return css + "}\n";
}

export default function FigmaImporter() {
  const [figmaUrl, setFigmaUrl] = useState("");
  const [token, setToken] = useState("");
  const [supabaseKey, setSupabaseKey] = useState(DEFAULT_KEY);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [design, setDesign] = useState(null);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("layers");
  const [expanded, setExpanded] = useState({});
  const [copied, setCopied] = useState(false);

  const allNodes = useMemo(() => design ? walk([design.document]) : [], [design]);
  const selectedNode = selected ? allNodes.find((n) => n.id === selected) : null;
  const filteredNodes = useMemo(() => allNodes.filter((n) => (n.name || "").toLowerCase().includes(query.toLowerCase()) || (n.type || "").toLowerCase().includes(query.toLowerCase())), [allNodes, query]);
  const counts = useMemo(() => ({
    layers: allNodes.length,
    text: allNodes.filter(n => n.type === "TEXT").length,
    images: allNodes.filter(n => (n.fills || []).some(f => f.type === "IMAGE")).length,
    vectors: allNodes.filter(n => ["VECTOR","BOOLEAN_OPERATION"].includes(n.type)).length
  }), [allNodes]);

  async function importDesign(e) {
    e?.preventDefault(); setError(""); setLoading(true); setDesign(null); setSelected(null);
    try {
      if (!token.trim()) throw new Error("Add your Figma personal access token to continue.");
      if (!supabaseKey.trim()) throw new Error("Add the Supabase publishable/anon key in connection settings.");
      const { fileKey, nodeId } = parseFigmaUrl(figmaUrl);
      const response = await fetch(FUNCTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: supabaseKey.trim() },
        body: JSON.stringify({ fileKey, nodeId, figmaToken: token.trim() })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || "Unable to read this Figma file.");
      setDesign(payload);
      const root = payload.document?.children?.[0] || payload.document;
      if (root?.id) setSelected(root.id);
      setExpanded({ [payload.document?.id]: true, [root?.id]: true });
    } catch (err) { setError(err.message || "Something went wrong while importing the design."); }
    finally { setLoading(false); }
  }

  function exportAssets() {
    const assets = design?.assets || [];
    if (!assets.length) { setError("No exportable image or vector assets were found in this frame."); return; }
    assets.forEach((asset, i) => {
      const a = document.createElement("a"); a.href = asset.url; a.target = "_blank"; a.rel = "noreferrer"; a.download = asset.name || `figma-asset-${i + 1}`; a.click();
    });
  }
  async function copyText(value) {
    try { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { setError("Clipboard access was blocked by the browser."); }
  }
  function exportJson() { downloadText("figma-design.json", JSON.stringify(design, null, 2), "application/json"); }
  function exportTokens() { downloadText("figma-tokens.css", cssTokens(allNodes), "text/css"); }
  function exportReact() {
    if (!design?.document) return;
    const assetByNode = new Map((design.assets || []).map(asset => [asset.nodeId, asset.url]));
    const className = (node) => "figma-" + String(node.id || "layer").replace(/[^a-zA-Z0-9_-]/g, "-");
    const cssColor = (paint) => paint?.type === "SOLID" && paint.color
      ? `rgba(${Math.round(paint.color.r*255)}, ${Math.round(paint.color.g*255)}, ${Math.round(paint.color.b*255)}, ${paint.opacity ?? 1})`
      : null;
    const emit = (node, parent = null, depth = 2) => {
      const cls = className(node);
      const isText = node.type === "TEXT";
      const tag = isText ? "p" : "div";
      const label = isText ? String(node.characters || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\{ /g,"&#123;") : "";
      const children = (node.children || []).map(child => emit(child, node, depth + 1)).join("\n");
      const content = isText ? label : children;
      const pad = "  ".repeat(depth);
      return `${pad}<${tag} className="${cls}">${content ? "\n" + content + "\n" + pad : ""}</${tag}>`;
    };
    const css = [];
    const rules = (node, parent = null) => {
      const box = node.absoluteBoundingBox || {};
      const pbox = parent?.absoluteBoundingBox || {};
      const auto = parent?.layoutMode === "HORIZONTAL" || parent?.layoutMode === "VERTICAL";
      const fills = (node.fills || []).filter(p => p.visible !== false);
      const solid = fills.find(p => p.type === "SOLID");
      const image = fills.find(p => p.type === "IMAGE");
      const imageUrl = assetByNode.get(node.id);
      const style = node.style || {};
      const lines = [`.${className(node)} {`];
      if (!parent) {
        lines.push("  position: relative;");
        lines.push("  width: 100%;");
        lines.push("  min-height: 100vh;");
      } else if (parent?.layoutMode === "HORIZONTAL" || parent?.layoutMode === "VERTICAL") {
        lines.push("  position: relative;");
        lines.push(`  flex: ${node.layoutGrow ? "1 1 0" : "0 0 auto"};`);
        if (box.width) lines.push(`  width: ${box.width}px;`);
        if (box.height) lines.push(`  min-height: ${box.height}px;`);
      } else {
        lines.push("  position: absolute;");
        if (box.x != null && pbox.x != null) lines.push(`  left: ${box.x-pbox.x}px;`);
        if (box.y != null && pbox.y != null) lines.push(`  top: ${box.y-pbox.y}px;`);
        if (box.width) lines.push(`  width: ${box.width}px;`);
        if (box.height) lines.push(`  height: ${box.height}px;`);
      }
      if (node.layoutMode === "HORIZONTAL" || node.layoutMode === "VERTICAL") {
        lines.push("  display: flex;");
        lines.push(`  flex-direction: ${node.layoutMode === "HORIZONTAL" ? "row" : "column"};`);
        if (node.itemSpacing != null) lines.push(`  gap: ${node.itemSpacing}px;`);
        lines.push(`  padding: ${node.paddingTop||0}px ${node.paddingRight||0}px ${node.paddingBottom||0}px ${node.paddingLeft||0}px;`);
        if (node.primaryAxisAlignItems) lines.push(`  justify-content: ${({MIN:"flex-start",CENTER:"center",MAX:"flex-end",SPACE_BETWEEN:"space-between"})[node.primaryAxisAlignItems] || "flex-start"};`);
        if (node.counterAxisAlignItems) lines.push(`  align-items: ${({MIN:"flex-start",CENTER:"center",MAX:"flex-end",BASELINE:"baseline"})[node.counterAxisAlignItems] || "stretch"};`);
      }
      if (solid) lines.push(`  background-color: ${cssColor(solid)};`);
      if (image && imageUrl) lines.push(`  background-image: url("${imageUrl}"); background-size: cover; background-position: center;`);
      if (node.cornerRadius) lines.push(`  border-radius: ${node.cornerRadius}px;`);
      if (node.opacity != null && node.opacity !== 1) lines.push(`  opacity: ${node.opacity};`);
      if (isText) {
        if (style.fontFamily) lines.push(`  font-family: "${style.fontFamily}", sans-serif;`);
        if (style.fontSize) lines.push(`  font-size: ${style.fontSize}px;`);
        if (style.fontWeight) lines.push(`  font-weight: ${style.fontWeight};`);
        if (style.lineHeightPx) lines.push(`  line-height: ${style.lineHeightPx}px;`);
        if (style.letterSpacing) lines.push(`  letter-spacing: ${style.letterSpacing}px;`);
        if (style.textAlignHorizontal) lines.push(`  text-align: ${style.textAlignHorizontal.toLowerCase()};`);
        const textFill = fills.find(p => p.type === "SOLID");
        if (textFill) lines.push(`  color: ${cssColor(textFill)};`);
        lines.push("  margin: 0;");
        lines.push("  white-space: pre-wrap;");
      }
      lines.push("}");
      css.push(lines.join("\n"));
      (node.children || []).forEach(child => rules(child, node));
    };
    rules(design.document);
    const jsx = `import React from "react";\nimport "./FigmaExport.css";\n\nexport default function FigmaExport() {\n  return (\n    <main className="${className(design.document)}">\n${(design.document.children || []).map(child => emit(child, design.document, 3)).join("\n")}\n    </main>\n  );\n}\n`;
    downloadText("FigmaExport.jsx", jsx, "text/javascript");
    downloadText("FigmaExport.css", css.join("\n\n"), "text/css");
  }

  function exportAssetsManifest() { downloadText("figma-assets.json", JSON.stringify(design.assets || [], null, 2), "application/json"); }

  const renderTree = (node, depth = 0) => {
    if (!node) return null;
    const hasChildren = node.children?.length > 0;
    return <React.Fragment key={node.id}>
      <button className={`layer-row ${selected === node.id ? "selected" : ""}`} style={{ paddingLeft: 12 + depth * 15 }} onClick={() => { setSelected(node.id); if (hasChildren) setExpanded(s => ({ ...s, [node.id]: !s[node.id] })); }}>
        {hasChildren ? <span className="tree-chevron">{expanded[node.id] ? <ChevronDown size={13}/> : <ChevronRight size={13}/>}</span> : <span className="tree-spacer"/>}
        <NodeIcon type={node.type}/>
        <span className="layer-name">{node.name || "Untitled"}</span><span className="layer-type">{node.type?.toLowerCase().replaceAll("_"," ")}</span>
      </button>
      {hasChildren && expanded[node.id] && node.children.map(child => renderTree(child, depth + 1))}
    </React.Fragment>;
  };

  return <main className="figma-studio">
    <header className="studio-topbar">
      <a className="studio-brand" href="./"><span className="brand-mark"><Figma size={19}/></span><span>ParcelX <b>Studio</b></span></a>
      <div className="topbar-center"><span className="live-dot"/> Design extraction workspace <span className="topbar-divider"/> <span className="free-label">FREE-TIER FRIENDLY</span></div>
      <button className="icon-button" onClick={() => setShowSettings(v => !v)} title="Connection settings"><Settings2 size={18}/></button>
    </header>

    <section className="studio-content">
      <div className="intro-row">
        <div><div className="eyebrow"><Sparkles size={13}/> FIGMA DESIGN INSPECTOR</div><h1>From Figma to <span>pixel-perfect code.</span></h1><p>Read the real design values, inspect every layer and export the assets your website needs.</p></div>
        <div className="intro-chip"><LockKeyhole size={15}/> Your Figma token is used for this import only</div>
      </div>

      <form className="import-panel" onSubmit={importDesign}>
        <div className="import-heading"><div className="import-icon"><Figma size={21}/></div><div><strong>Import a Figma design</strong><small>Paste a design link. Choose a frame with the node-id parameter for a focused import.</small></div></div>
        <div className="import-fields">
          <label className="url-field"><Link2 size={17}/><input value={figmaUrl} onChange={e => setFigmaUrl(e.target.value)} placeholder="Paste Figma design URL here..." aria-label="Figma design URL"/></label>
          <label className="token-field"><LockKeyhole size={16}/><input type="password" value={token} onChange={e => setToken(e.target.value)} placeholder="Figma personal access token" aria-label="Figma personal access token" autoComplete="off"/></label>
          <button className="import-button" disabled={loading}>{loading ? <LoaderCircle className="spin" size={17}/> : <ArrowRight size={17}/>} {loading ? "Reading design..." : "Import design"}</button>
        </div>
        {error && <div className="error-message"><CircleHelp size={15}/>{error}</div>}
        <div className="import-foot"><span><Check size={13}/> No Figma MCP required</span><span><Check size={13}/> No Dev Mode dependency</span><button type="button" onClick={() => setShowSettings(v => !v)}>Connection settings <ChevronDown size={13}/></button></div>
        {showSettings && <div className="settings-panel"><label>Supabase publishable / anon key<input value={supabaseKey} onChange={e => setSupabaseKey(e.target.value)} placeholder="sb_publishable_... or legacy anon key"/></label><small>Used only to call the ParcelX Supabase Edge Function. Never enter a service-role or secret key here.</small></div>}
      </form>

      {!design ? <div className="empty-state"><div className="empty-illustration"><div className="empty-card card-back"/><div className="empty-card card-front"><Layers3 size={30}/><span/><span/></div><div className="empty-spark spark-one">✳</div><div className="empty-spark spark-two">✦</div></div><h2>Your design workspace is ready</h2><p>Import a Figma file to inspect its structure, typography, colors, measurements and downloadable assets.</p><div className="empty-capabilities"><span><Type size={15}/> Typography</span><span><Palette size={15}/> Colors</span><span><Ruler size={15}/> Spacing</span><span><ImageIcon size={15}/> Assets</span></div></div>
      : <div className="workspace">
        <div className="project-heading"><div><div className="eyebrow">IMPORTED FILE</div><h2>{design.name || "Untitled Figma file"}</h2><small>{design.lastModified ? "Last modified " + new Date(design.lastModified).toLocaleString() : "Figma design file"} · {counts.layers} layers detected</small></div><div className="export-actions"><button className="secondary-button" onClick={exportJson}><FileJson size={15}/> Export JSON</button><button className="secondary-button" onClick={exportTokens}><Code2 size={15}/> CSS tokens</button><button className="secondary-button" onClick={exportReact}><Code2 size={15}/> React + CSS</button><button className="primary-small" onClick={exportAssets}><ArrowDownToLine size={15}/> Download assets</button></div></div>
        <div className="stat-grid"><Stat icon={<Layers3/>} label="Total layers" value={counts.layers}/><Stat icon={<Type/>} label="Text layers" value={counts.text}/><Stat icon={<ImageIcon/>} label="Image fills" value={counts.images}/><Stat icon={<Frame/>} label="Vector layers" value={counts.vectors}/></div>
        <div className="inspector-layout">
          <section className="panel layers-panel"><div className="panel-heading"><div><Layers3 size={17}/><b>Layers</b><span className="count-pill">{counts.layers}</span></div></div><div className="layer-search"><Search size={15}/><input placeholder="Search layers..." value={query} onChange={e => setQuery(e.target.value)}/><kbd>⌘ K</kbd></div><div className="layer-list">{query ? filteredNodes.slice(0,120).map(n => <button key={n.id} className={`layer-row ${selected===n.id?"selected":""}`} onClick={() => setSelected(n.id)}><NodeIcon type={n.type}/><span className="layer-name">{n.name}</span><span className="layer-type">{n.type}</span></button>) : renderTree(design.document)}</div></section>
          <section className="panel details-panel"><div className="detail-tabs"><button className={activeTab==="layers"?"active":""} onClick={()=>setActiveTab("layers")}>Properties</button><button className={activeTab==="assets"?"active":""} onClick={()=>setActiveTab("assets")}>Assets <span>{design.assets?.length || 0}</span></button></div>
            {activeTab==="assets" ? <div className="assets-grid">{(design.assets||[]).map((asset,i)=><a key={asset.nodeId} className="asset-card" href={asset.url} target="_blank" rel="noreferrer"><div className="asset-preview">{asset.format==="svg"?<Code2/>:<FileImage/>}</div><b>{asset.name || "Asset " + (i+1)}</b><small>{asset.format?.toUpperCase()} · {asset.nodeId}</small></a>)}{!design.assets?.length&&<div className="no-selection">No exportable assets detected.</div>}</div>
            : selectedNode ? <PropertyInspector node={selectedNode} copied={copied} onCopy={copyText}/> : <div className="no-selection">Select a layer to inspect its design properties.</div>}
          </section>
        </div>
        <div className="workspace-note"><Activity size={15}/><span>Values are extracted from Figma's node data. Auto Layout values are shown separately from absolute position so you can reproduce responsive behaviour accurately.</span></div>
      </div>}
      <footer className="studio-footer"><span>ParcelX Studio <span className="footer-dot">·</span> Figma Importer</span><span>Built with Figma REST API + Supabase Edge Functions</span></footer>
    </section>
  </main>;
}

function NodeIcon({type}) {
  const common={size:14,strokeWidth:1.8};
  if(type==="TEXT") return <Type {...common} className="node-type-text"/>;
  if(type==="FRAME"||type==="COMPONENT"||type==="INSTANCE") return <Frame {...common} className="node-type-frame"/>;
  if(type==="VECTOR"||type==="BOOLEAN_OPERATION") return <PenIcon/>;
  if(type==="RECTANGLE"||type==="ELLIPSE"||type==="LINE") return <Box {...common}/>;
  return <Layers3 {...common}/>;
}
function PenIcon(){return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m4 20 4.5-1 11-11a2.1 2.1 0 0 0-3-3l-11 11L4 20Z"/></svg>}
function Stat({icon,label,value}){return <div className="stat-card"><span className="stat-icon">{React.cloneElement(icon,{size:17})}</span><div><b>{value.toLocaleString()}</b><small>{label}</small></div></div>}
function PropertyInspector({node,copied,onCopy}){
  const box=node.absoluteBoundingBox||{}; const style=node.style||{}; const layout=node.layoutMode||"";
  const fills=(node.fills||[]).filter(f=>f.visible!==false); const strokes=(node.strokes||[]).filter(f=>f.visible!==false);
  const textValue=[node.characters, node.name].filter(Boolean).join("\n");
  const groups=[
    {title:"Dimensions & position",icon:<Ruler/>,rows:[["X",px(box.x)],["Y",px(box.y)],["Width",px(box.width)],["Height",px(box.height)],["Rotation",node.rotation!=null?node.rotation+"°":"—"]]},
    {title:"Auto Layout & spacing",icon:<Layers3/>,rows:[["Layout mode",layout||"None"],["Direction",node.primaryAxisAlignItems||"—"],["Item gap",px(node.itemSpacing)],["Padding top",px(node.paddingTop)],["Padding right",px(node.paddingRight)],["Padding bottom",px(node.paddingBottom)],["Padding left",px(node.paddingLeft)],["Cross-axis gap",px(node.counterAxisSpacing)]]},
    {title:"Typography",icon:<Type/>,rows:[["Font family",style.fontFamily||"—"],["Font style",style.fontPostScriptName||"—"],["Weight",style.fontWeight||"—"],["Size",px(style.fontSize)],["Line height",style.lineHeightPx?px(style.lineHeightPx):style.lineHeightPercent?style.lineHeightPercent+"%":"—"],["Letter spacing",style.letterSpacing!=null?px(style.letterSpacing):"—"],["Text align",style.textAlignHorizontal||"—"]]},
    {title:"Appearance",icon:<Palette/>,rows:[["Opacity",node.opacity!=null?Math.round(node.opacity*100)+"%":"—"],["Corner radius",node.cornerRadius!=null?px(node.cornerRadius):"—"],["Blend mode",node.blendMode||"—"],["Clips content",node.clipsContent?"Yes":"No"]]}
  ];
  return <div className="property-content"><div className="selected-layer"><div><NodeIcon type={node.type}/><b>{node.name||"Untitled layer"}</b></div><small>{node.type} · {node.id}</small></div>
    {groups.map((g,i)=><section className="property-group" key={g.title}><h4>{g.icon}{g.title}</h4><div className="property-grid">{g.rows.map(([k,v])=><div className="property-row" key={k}><span>{k}</span><b>{v}</b></div>)}</div></section>)}
    <section className="property-group"><h4><Palette/> Fills & strokes</h4>{fills.length?fills.map((f,i)=><div className="paint-row" key={i}><span className="paint-swatch" style={{background:f.type==="SOLID"?rgba(f.color):"linear-gradient(135deg,#aaa,#eee)"}}/><span>{f.type==="SOLID"?rgba(f.color,f.opacity??1):f.type}</span><small>{f.opacity!=null?Math.round(f.opacity*100)+"%":"100%"}</small></div>):<div className="muted-line">No visible fills</div>}{strokes.map((f,i)=><div className="paint-row" key={"s"+i}><span className="paint-swatch stroke-swatch" style={{background:f.type==="SOLID"?rgba(f.color):"#fff"}}/><span>Stroke · {f.type==="SOLID"?rgba(f.color):f.type}</span></div>)}</section>
    {node.characters&&<section className="property-group"><div className="group-title-action"><h4><Type/> Text content</h4><button onClick={()=>onCopy(textValue)}><Copy size={13}/>{copied?"Copied":"Copy text"}</button></div><div className="text-content-preview">{node.characters}</div></section>}
  </div>;
}
