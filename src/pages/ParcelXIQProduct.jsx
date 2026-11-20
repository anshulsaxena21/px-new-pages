import React, { useEffect, useState } from "react";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Boxes,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronRight,
  Code2,
  Database,
  Gauge,
  Globe2,
  Headset,
  Layers,
  LockKeyhole,
  MessageCircle,
  MonitorSmartphone,
  PackageCheck,
  PanelTop,
  Plug,
  Radio,
  ShieldCheck,
  Sparkles,
  Ticket,
  Truck,
  Wallet,
  Workflow,
  Zap
} from "lucide-react";
import logo from "../images/ParcelX_Logo.svg";
import "../styles/parcelx-iq-product.css";

const demoBaseUrl = "/px-new-pages/parcelx-iq-demo.html";
const demoUrl = `${demoBaseUrl}?intent=demo`;
const integrationUrl = `${demoBaseUrl}?intent=integration`;
const questionUrl = `${demoBaseUrl}?intent=question`;
const standaloneUrl = `${demoBaseUrl}?intent=standalone`;
const embeddedUrl = `${demoBaseUrl}?intent=embedded`;

const capabilities = [
  {
    id: "analytics",
    number: "01",
    title: "Shipping Analytics",
    text: "See shipping performance through the views that matter to your team.",
    detail: "Explore zone-wise, courier-wise and user-wise reports to understand activity across your shipping operations.",
    icon: BarChart3,
    tone: "violet"
  },
  {
    id: "tickets",
    number: "02",
    title: "Ticket Tracking",
    text: "Keep every query, update and follow-up in view.",
    detail: "Follow support ticket progress, review updates and keep pending conversations from getting lost.",
    icon: Ticket,
    tone: "blue"
  },
  {
    id: "wallet",
    number: "03",
    title: "Wallet Recharge",
    text: "Keep your shipping wallet ready for business as usual.",
    detail: "View wallet information and access the recharge journey from your IQ workspace.",
    icon: Wallet,
    tone: "teal"
  },
  {
    id: "tracking",
    number: "04",
    title: "Shipment Tracking",
    text: "Know where shipments stand as they move through delivery.",
    detail: "Follow shipment progress and check delivery-stage updates in one convenient view.",
    icon: Truck,
    tone: "amber"
  },
  {
    id: "ndr",
    number: "05",
    title: "NDR Escalation",
    text: "Bring non-delivery cases that need attention to the surface.",
    detail: "Escalate NDR cases that require further action and keep the follow-up visible to your team.",
    icon: Activity,
    tone: "coral"
  },
  {
    id: "support",
    number: "06",
    title: "Support",
    text: "Find help for the shipping issues that need a human touch.",
    detail: "Access assistance for shipping, account, wallet and day-to-day operational queries.",
    icon: Headset,
    tone: "indigo"
  }
];

const faqs = [
  {
    q: "What is ParcelX IQ?",
    a: "ParcelX IQ is a shipping operations and intelligence product that brings analytics, ticket tracking, wallet recharge, shipment tracking, NDR escalation and support into one connected experience."
  },
  {
    q: "Can I use ParcelX IQ without using the complete ParcelX shipping platform?",
    a: "The standalone product direction is designed to give sellers a dedicated IQ workspace. The exact data connection and account requirements can be discussed with the ParcelX team during a product walkthrough."
  },
  {
    q: "Can ParcelX IQ be embedded into my website or seller portal?",
    a: "The product is being positioned for both standalone and embedded use. The right integration approach, available modules, permissions and technical requirements should be scoped with the ParcelX team for your environment."
  },
  {
    q: "What analytics views are available?",
    a: "The core Shipping Analytics capability includes zone-wise, courier-wise and user-wise report views."
  },
  {
    q: "Which capabilities are part of ParcelX IQ?",
    a: "The six core capabilities are Shipping Analytics, Ticket Tracking, Wallet Recharge, Shipment Tracking, NDR Escalation and Support."
  },
  {
    q: "How do I explore ParcelX IQ for my business?",
    a: "Request a product walkthrough. The team can discuss your shipping workflow, intended use, data requirements and whether a standalone or embedded experience is the better fit."
  }
];

function ProductNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    ["Platform", "#platform"],
    ["Capabilities", "#capabilities"],
    ["Ways to use IQ", "#deployment"],
    ["Integration", "#integration"],
    ["FAQs", "#faqs"]
  ];
  return (
    <header className="pxq-nav">
      <div className="pxq-nav-inner">
        <a className="pxq-logo" href="#top" aria-label="ParcelX IQ home">
          <img src={logo} alt="ParcelX" />
          <span className="pxq-logo-divider" />
          <b>IQ</b>
        </a>
        <button className="pxq-menu-toggle" type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(v => !v)}>
          <span/><span/><span/>
        </button>
        <nav className={menuOpen ? "pxq-nav-links is-open" : "pxq-nav-links"} aria-label="Product navigation">
          {links.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
          <a className="pxq-nav-login" href="#deployment">Choose your setup <ArrowUpRight size={14}/></a>
          <a className="pxq-nav-cta" href={demoUrl}>Request a demo <ArrowRight size={15}/></a>
        </nav>
      </div>
    </header>
  );
}

function DashboardPreview() {
  return (
    <div className="pxq-dashboard-wrap">
      <div className="pxq-dash-halo pxq-halo-one"/>
      <div className="pxq-dash-halo pxq-halo-two"/>
      <div className="pxq-dashboard-window">
        <aside className="pxq-dash-sidebar">
          <div className="pxq-dash-brand"><span>PX</span><b>ParcelX <i>IQ</i></b></div>
          <div className="pxq-dash-workspace">WORKSPACE</div>
          <div className="pxq-dash-item selected"><Gauge size={15}/> Overview</div>
          <div className="pxq-dash-item"><BarChart3 size={15}/> Analytics</div>
          <div className="pxq-dash-item"><Ticket size={15}/> Tickets</div>
          <div className="pxq-dash-item"><Wallet size={15}/> Wallet</div>
          <div className="pxq-dash-item"><Truck size={15}/> Shipments</div>
          <div className="pxq-dash-item"><Headset size={15}/> Support</div>
          <div className="pxq-dash-profile"><span>AS</span><div><b>Your workspace</b><small>Seller account</small></div></div>
        </aside>
        <div className="pxq-dash-main">
          <div className="pxq-dash-top"><span>Workspace <b>/ Overview</b></span><span className="pxq-dash-date">Last 30 days⌄</span></div>
          <div className="pxq-dash-greeting"><div><small>YOUR SHIPPING WORKSPACE</small><h3>A clearer view of your operations.</h3><p>Explore the activity that matters to your business.</p></div><span className="pxq-dash-status"><i/> Overview</span></div>
          <div className="pxq-dash-kpis">
            <div className="pxq-kpi kpi-violet"><span><PackageCheck size={15}/></span><small>Shipments</small><b>12,480</b><em>Illustrative view</em></div>
            <div className="pxq-kpi kpi-teal"><span><CheckCircle2 size={15}/></span><small>Delivered</small><b>11,526</b><em>Illustrative view</em></div>
            <div className="pxq-kpi kpi-amber"><span><Ticket size={15}/></span><small>Open tickets</small><b>24</b><em>Illustrative view</em></div>
          </div>
          <div className="pxq-dash-bottom">
            <div className="pxq-dash-chart">
              <div className="pxq-dash-chart-head"><b>Shipping activity</b><span>Zone-wise view⌄</span></div>
              <svg viewBox="0 0 460 145" role="img" aria-label="Illustrative shipping activity chart">
                <defs><linearGradient id="pxqArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8074df" stopOpacity=".21"/><stop offset="100%" stopColor="#8074df" stopOpacity="0"/></linearGradient></defs>
                <g stroke="#edf0f4" strokeWidth="1"><path d="M0 20H460M0 55H460M0 90H460M0 125H460"/></g>
                <path d="M0 105 C30 102 39 88 69 93 S110 67 140 80 S183 62 210 69 S248 48 280 56 S321 38 350 45 S408 18 460 24 V145H0Z" fill="url(#pxqArea)"/>
                <path d="M0 105 C30 102 39 88 69 93 S110 67 140 80 S183 62 210 69 S248 48 280 56 S321 38 350 45 S408 18 460 24" fill="none" stroke="#786bdd" strokeWidth="3" strokeLinecap="round"/>
                <path d="M0 119 C40 114 48 120 80 113 S132 101 161 110 S210 92 246 101 S303 85 337 96 S399 77 460 85" fill="none" stroke="#35ae9b" strokeWidth="2.5" strokeDasharray="5 6" strokeLinecap="round"/>
              </svg>
              <div className="pxq-chart-legend"><span><i className="legend-purple"/> Shipping activity</span><span><i className="legend-teal"/> Delivery updates</span></div>
            </div>
            <div className="pxq-dash-assist"><span><BrainCircuit size={17}/></span><small>PARCELX IQ</small><b>What would you like to explore?</b><p>Ask about reports, tickets or shipments.</p><div>Ask a question <ArrowUpRight size={12}/></div></div>
          </div>
        </div>
      </div>
      <div className="pxq-preview-caption"><span><i/> Product interface preview</span><span>Illustrative data · Not connected to a live account</span></div>
      <div className="pxq-float-chip pxq-float-top"><span><Layers size={15}/></span><b>One IQ workspace</b><small>Connected operations</small></div>
      <div className="pxq-float-chip pxq-float-bottom"><span><ShieldCheck size={15}/></span><b>Your workflow, your way</b><small>Standalone or embedded</small></div>
    </div>
  );
}

function EmbedPreview() {
  return (
    <div className="pxq-embed-demo">
      <div className="pxq-embed-browser">
        <div className="pxq-browser-bar"><span/><span/><span/><i>seller.yourstore.com / operations</i></div>
        <div className="pxq-embed-site">
          <div className="pxq-embed-site-nav"><b>YOUR BRAND</b><span>Dashboard</span><span>Orders</span><span>Shipping</span><span>Account</span></div>
          <div className="pxq-embed-main">
            <div className="pxq-embed-side"><b>OPERATIONS</b><span>Overview</span><span>Orders</span><span className="active">Shipping IQ</span><span>Support</span></div>
            <div className="pxq-embed-content">
              <small>YOUR BRAND / SHIPPING IQ</small>
              <h4>Shipping, in focus.</h4>
              <div className="pxq-embed-cards"><span><i className="embed-purple"><BarChart3 size={15}/></i><b>Analytics</b><small>Zone · Courier · User</small></span><span><i className="embed-blue"><Truck size={15}/></i><b>Tracking</b><small>Shipment updates</small></span><span><i className="embed-teal"><Ticket size={15}/></i><b>Tickets</b><small>Query status</small></span></div>
              <div className="pxq-embed-chart"><div><b>Shipping overview</b><small>Illustrative embedded module</small></div><div className="pxq-embed-bars"><i/><i/><i/><i/><i/><i/><i/></div></div>
            </div>
          </div>
        </div>
      </div>
      <div className="pxq-embed-note"><PanelTop size={15}/> IQ modules shown within a seller-branded portal concept</div>
    </div>
  );
}

function CapabilityIcon({ icon: Icon, tone }) {
  return <span className={"pxq-cap-icon tone-" + tone}><Icon size={20}/></span>;
}

function FAQItem({ item, index, open, onToggle }) {
  return (
    <div className={open ? "pxq-faq-item active" : "pxq-faq-item"}>
      <button type="button" aria-expanded={open} onClick={onToggle}>
        <span><i>{String(index + 1).padStart(2,"0")}</i>{item.q}</span>
        <span className="pxq-faq-plus">{open ? "−" : "+"}</span>
      </button>
      {open && <p>{item.a}</p>}
    </div>
  );
}

export default function ParcelXIQProduct() {
  const [deployment, setDeployment] = useState("standalone");
  const [faqOpen, setFaqOpen] = useState(0);
  const [reportView, setReportView] = useState("zone");

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "ParcelX IQ — AI-powered shipping intelligence";
    return () => { document.title = previousTitle; };
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealTargets = document.querySelectorAll(
      ".pxq-intro-grid, .pxq-value-row > div, .pxq-deployment .pxq-section-tag, .pxq-section-heading, .pxq-adoption-panel, .pxq-model-note, .pxq-cap-card, .pxq-analytics-copy, .pxq-report-board, .pxq-integration-head, .pxq-architecture, .pxq-integration-foot, .pxq-steps-head, .pxq-step-grid article, .pxq-steps-note, .pxq-faq-intro, .pxq-faq-item, .pxq-final-inner"
    );
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealTargets.forEach((element) => element.classList.add("pxq-revealed"));
      return undefined;
    }

    revealTargets.forEach((element, index) => {
      element.classList.add("pxq-reveal");
      element.style.setProperty("--pxq-reveal-delay", (index % 4) * 75 + "ms");
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("pxq-revealed");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -40px 0px" });

    revealTargets.forEach((element) => observer.observe(element));

    const progress = document.querySelector(".pxq-scroll-progress");
    let frame = 0;
    const updateProgress = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const amount = scrollable > 0 ? window.scrollY / scrollable : 0;
        if (progress) progress.style.transform = "scaleX(" + Math.min(1, Math.max(0, amount)) + ")";
      });
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateProgress);
      cancelAnimationFrame(frame);
    };
  }, []);

  const adoption = deployment === "standalone"
    ? {
        eyebrow: "STANDALONE IQ WORKSPACE",
        title: "A dedicated home for your shipping operations.",
        text: "Give your team a focused ParcelX IQ workspace to review reports, follow shipments, manage tickets, handle wallet activity and escalate NDR cases.",
        bullets: ["A dedicated IQ workspace for your team", "A consolidated view of six core capabilities", "A focused experience for day-to-day shipping operations"],
        icon: MonitorSmartphone,
        tone: "violet"
      }
    : {
        eyebrow: "EMBEDDED IQ EXPERIENCE",
        title: "Bring shipping intelligence into your own environment.",
        text: "Explore an embedded experience that brings selected IQ modules into your website, seller portal or internal admin workflow—so your team can work closer to the systems they already use.",
        bullets: ["Explore selected IQ modules inside your portal", "Align the experience to your brand and workflow", "Scope access, data and integration needs with the ParcelX team"],
        icon: Code2,
        tone: "blue"
      };
  const AdoptionIcon = adoption.icon;

  const reportRows = {
    zone: [["North", 84], ["West", 72], ["South", 77], ["East", 61]],
    courier: [["Courier A", 91], ["Courier B", 78], ["Courier C", 69], ["Courier D", 63]],
    user: [["Operations", 88], ["Support", 76], ["Admin", 70], ["Warehouse", 64]]
  };
  const reportLabels = { zone: "Zone-wise", courier: "Courier-wise", user: "User-wise" };
  const activeReportRows = reportRows[reportView];

  return (
    <main className="pxq-product">
      <div className="pxq-scroll-progress" aria-hidden="true" />
      <ProductNav/>

      <section className="pxq-hero" id="top">
        <div className="pxq-hero-grid"/>
        <div className="pxq-shell pxq-hero-layout">
          <div className="pxq-hero-copy">
            <div className="pxq-eyebrow"><span><Sparkles size={13}/></span> PARCELX IQ · SHIPPING INTELLIGENCE</div>
            <h1>Shipping intelligence.<br/><span>Built around your business.</span></h1>
            <p>Bring clarity to every part of your shipping operation. Use ParcelX IQ as a dedicated workspace—or explore embedding selected capabilities into your own website and seller portal.</p>
            <div className="pxq-hero-actions">
              <a href={demoUrl} className="pxq-btn pxq-btn-primary">Request a product walkthrough <ArrowRight size={16}/></a>
              <a href="#deployment" className="pxq-btn pxq-btn-secondary">Explore ways to use IQ <ArrowUpRight size={16}/></a>
            </div>
            <div className="pxq-hero-proof"><span><Check size={14}/> Standalone workspace</span><span><Check size={14}/> Embedded experience</span><span><Check size={14}/> Six core capabilities</span></div>
          </div>
          <DashboardPreview/>
        </div>
        <div className="pxq-hero-bottom"><span>ONE PRODUCT</span><i/><span>TWO WAYS TO WORK</span><i/><span>YOUR SHIPPING, IN FOCUS</span></div>
      </section>

      <section className="pxq-intro pxq-shell" id="platform">
        <div className="pxq-section-tag"><span>01</span> THE PRODUCT</div>
        <div className="pxq-intro-grid">
          <h2>One intelligence layer.<br/><span>More control over shipping.</span></h2>
          <div><p>Shipping work rarely happens in one place. Reports sit in one system, shipment updates in another and support conversations somewhere else.</p><p>ParcelX IQ is designed to bring these essential workflows into one connected experience—giving sellers a clearer view of what is happening and where attention is needed.</p></div>
        </div>
        <div className="pxq-value-row">
          <div><span className="value-icon value-violet"><BrainCircuit size={19}/></span><b>Understand</b><p>Make sense of shipping activity through focused report views.</p></div>
          <div><span className="value-icon value-blue"><EyeIcon/></span><b>Stay informed</b><p>Keep shipment movement and ticket updates visible.</p></div>
          <div><span className="value-icon value-teal"><Workflow size={19}/></span><b>Take action</b><p>Move wallet, escalation and support tasks forward.</p></div>
        </div>
      </section>

      <section className="pxq-deployment" id="deployment">
        <div className="pxq-shell">
          <div className="pxq-section-tag"><span>02</span> TWO WAYS TO USE PARCELX IQ</div>
          <div className="pxq-section-heading">
            <div><h2>Fits your setup.<br/><span>Not the other way around.</span></h2><p>Start with the experience that suits your team, then discuss how IQ should fit into your existing operations.</p></div>
            <div className="pxq-mode-switch" role="tablist" aria-label="Choose a ParcelX IQ deployment model">
              <button type="button" role="tab" aria-selected={deployment === "standalone"} className={deployment === "standalone" ? "active" : ""} onClick={() => setDeployment("standalone")}>Standalone</button>
              <button type="button" role="tab" aria-selected={deployment === "embedded"} className={deployment === "embedded" ? "active" : ""} onClick={() => setDeployment("embedded")}>Embedded</button>
            </div>
          </div>
          <div className="pxq-adoption-panel">
            <div className="pxq-adoption-copy">
              <div className={"pxq-adoption-icon " + adoption.tone}><AdoptionIcon size={22}/></div>
              <small>{adoption.eyebrow}</small>
              <h3>{adoption.title}</h3>
              <p>{adoption.text}</p>
              <ul>{adoption.bullets.map(item => <li key={item}><CheckCircle2 size={15}/>{item}</li>)}</ul>
              <a href={deployment === "standalone" ? standaloneUrl : embeddedUrl} className="pxq-text-link">Discuss this setup <ArrowRight size={15}/></a>
            </div>
            {deployment === "standalone" ? <DashboardPreview/> : <EmbedPreview/>}
          </div>
          <p className="pxq-model-note"><LockKeyhole size={14}/> The exact setup, data access and module availability are scoped with the ParcelX team for each business.</p>
        </div>
      </section>

      <section className="pxq-capabilities pxq-shell" id="capabilities">
        <div className="pxq-section-tag"><span>03</span> WHAT IQ CAN DO</div>
        <div className="pxq-section-heading">
          <div><h2>Six capabilities.<br/><span>One connected workspace.</span></h2><p>Bring essential shipping tasks together—from understanding performance to following up on issues and getting the help you need.</p></div>
          <span className="pxq-count">06 <i>CORE CAPABILITIES</i></span>
        </div>
        <div className="pxq-cap-grid">
          {capabilities.map(({id,number,title,text,detail,icon:Icon,tone}) => (
            <article className={"pxq-cap-card cap-" + tone} key={id}>
              <div className="pxq-cap-top"><span>{number} / IQ MODULE</span><CapabilityIcon icon={Icon} tone={tone}/></div>
              <h3>{title}</h3><p>{text}</p><div className="pxq-cap-detail">{detail}</div>
              <span className="pxq-cap-arrow"><ArrowUpRight size={16}/></span>
            </article>
          ))}
        </div>
      </section>

      <section className="pxq-analytics">
        <div className="pxq-shell pxq-analytics-layout">
          <div className="pxq-analytics-copy">
            <div className="pxq-section-tag"><span>04</span> SHIPPING ANALYTICS</div>
            <h2>Three views.<br/><span>One clearer picture.</span></h2>
            <p>Shipping Analytics helps you look at your operations from different angles. Move between zone-wise, courier-wise and user-wise reports to understand activity in the way your team needs.</p>
            <div className="pxq-analytics-points"><span><i className="dot-violet"/> Zone-wise reports</span><span><i className="dot-blue"/> Courier-wise reports</span><span><i className="dot-teal"/> User-wise reports</span></div>
          </div>
          <div className="pxq-report-board">
            <div className="pxq-report-board-head"><span><b>Shipping analytics</b><small>Illustrative report preview</small></span><span className="pxq-report-filter">{reportLabels[reportView]} view⌄</span></div>
            <div className="pxq-report-tabs" role="tablist" aria-label="Analytics report type">
              <button type="button" role="tab" aria-selected={reportView === "zone"} className={reportView === "zone" ? "active" : ""} onClick={() => setReportView("zone")}>Zone-wise</button>
              <button type="button" role="tab" aria-selected={reportView === "courier"} className={reportView === "courier" ? "active" : ""} onClick={() => setReportView("courier")}>Courier-wise</button>
              <button type="button" role="tab" aria-selected={reportView === "user"} className={reportView === "user" ? "active" : ""} onClick={() => setReportView("user")}>User-wise</button>
            </div>
            <div className="pxq-report-rows" key={reportView}>{activeReportRows.map(([label, value]) => <div key={label}><span>{label}</span><i><em style={{width:value + "%"}}/></i><b>{value}%</b></div>)}</div>
            <div className="pxq-report-footer"><span><Activity size={13}/> Example report layout</span><span>Illustrative data</span></div>
          </div>
        </div>
      </section>

      <section className="pxq-integration pxq-shell" id="integration">
        <div className="pxq-section-tag"><span>05</span> BUILT TO FIT YOUR ECOSYSTEM</div>
        <div className="pxq-integration-head"><h2>Keep your tools.<br/><span>Bring IQ into the picture.</span></h2><p>Whether your team works inside a dedicated IQ workspace or wants selected views within its own portal, the integration approach should fit your systems, access needs and workflow.</p></div>
        <div className="pxq-architecture">
          <div className="pxq-architecture-sources"><small>YOUR ENVIRONMENT</small><div><Globe2 size={17}/> Website or store</div><div><Database size={17}/> Shipping data</div><div><Boxes size={17}/> Seller operations</div></div>
          <div className="pxq-architecture-link"><span/><ArrowRight size={18}/><small>AGREED DATA & ACCESS</small></div>
          <div className="pxq-architecture-core"><span className="pxq-core-mark"><BrainCircuit size={26}/></span><small>INTELLIGENCE LAYER</small><b>ParcelX IQ</b><span>Six connected capabilities</span></div>
          <div className="pxq-architecture-link"><span/><ArrowRight size={18}/><small>CHOOSE YOUR EXPERIENCE</small></div>
          <div className="pxq-architecture-outputs"><small>YOUR TEAM</small><div><MonitorSmartphone size={17}/> Standalone workspace</div><div><PanelTop size={17}/> Embedded modules</div><div><BarChart3 size={17}/> Operational views</div></div>
        </div>
        <div className="pxq-integration-foot"><span><Plug size={15}/> Integration scope tailored to your environment</span><a href={integrationUrl}>Talk through your requirements <ArrowRight size={14}/></a></div>
      </section>

      <section className="pxq-steps">
        <div className="pxq-shell">
          <div className="pxq-section-tag"><span>06</span> GETTING STARTED</div>
          <div className="pxq-steps-head"><h2>From first conversation<br/><span>to a clearer workflow.</span></h2><p>Start with your current setup and the problems your team wants to solve. The ParcelX team can help shape the right IQ experience.</p></div>
          <div className="pxq-step-grid">
            <article><span className="step-num">01</span><span className="step-icon step-violet"><MessageCircle size={19}/></span><h3>Tell us how you work</h3><p>Share your shipping setup, team needs and whether you prefer standalone or embedded IQ.</p></article>
            <article><span className="step-num">02</span><span className="step-icon step-blue"><Workflow size={19}/></span><h3>Define your IQ setup</h3><p>Discuss the modules, data access, permissions and integration requirements for your business.</p></article>
            <article><span className="step-num">03</span><span className="step-icon step-teal"><Zap size={19}/></span><h3>Plan your rollout</h3><p>Agree the next steps for onboarding your team or exploring an embedded experience.</p></article>
          </div>
          <p className="pxq-steps-note">Availability and technical scope are confirmed during product discovery.</p>
        </div>
      </section>

      <section className="pxq-faq pxq-shell" id="faqs">
        <div className="pxq-faq-intro"><div className="pxq-section-tag"><span>07</span> QUESTIONS, ANSWERED</div><h2>Good to know<br/><span>before you get started.</span></h2><p>Learn more about using ParcelX IQ as a standalone workspace or exploring an embedded experience.</p><a href={questionUrl}>Still have questions? Talk to us <ArrowRight size={14}/></a></div>
        <div className="pxq-faq-list">{faqs.map((item,index)=><FAQItem key={item.q} item={item} index={index} open={faqOpen===index} onToggle={()=>setFaqOpen(faqOpen===index?-1:index)}/>)}</div>
      </section>

      <section className="pxq-final pxq-shell">
        <div className="pxq-final-inner">
          <div className="pxq-final-decoration"><span/><i/><i/><i/></div>
          <div className="pxq-section-tag"><span>LET'S TALK</span> YOUR NEXT SHIPPING WORKFLOW</div>
          <h2>Make room for<br/><span>smarter shipping operations.</span></h2>
          <p>Tell us how your team works today. We'll help you explore whether a standalone or embedded ParcelX IQ experience is right for your business.</p>
          <div className="pxq-final-actions"><a className="pxq-btn pxq-btn-primary" href={demoUrl}>Request a product walkthrough <ArrowRight size={16}/></a><a className="pxq-btn pxq-btn-light" href={integrationUrl}>Discuss an integration <ArrowUpRight size={16}/></a></div>
        </div>
      </section>

      <footer className="pxq-site-footer">
        <div className="pxq-site-footer-inner">
          <a className="pxq-logo" href="#top" aria-label="ParcelX IQ home">
            <img src={logo} alt="ParcelX" />
            <span className="pxq-logo-divider" />
            <b>IQ</b>
          </a>
          <span>Shipping intelligence, built around your business.</span>
          <nav aria-label="Footer navigation">
            <a href="#platform">Platform</a>
            <a href="#capabilities">Capabilities</a>
            <a href="#integration">Integration</a>
            <a href={demoUrl}>Request a demo <ArrowUpRight size={13}/></a>
          </nav>
          <small>© {new Date().getFullYear()} ParcelX IQ. All rights reserved.</small>
        </div>
      </footer>
    </main>
  );
}

function EyeIcon() {
  return <Activity size={19}/>;
}
