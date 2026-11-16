import React, { useEffect } from "react";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Boxes,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Database,
  FileText,
  Gauge,
  MessageCircle,
  PackageCheck,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Truck,
  Wallet,
  Workflow,
  Zap
} from "lucide-react";
import "../styles/parcelx-iq.css";
import "../styles/shared-faq.css";
import Header from "../includes/Header.jsx";
import Footer from "../includes/Footer.jsx";
import Faq from "../component/Faq.jsx";
import MainTestimonial from "../component/slider/MainTestimonial.jsx";

const registerUrl = "https://seller.parcelx.in/register";
const demoUrl = "mailto:hello@parcelx.in?subject=ParcelX%20IQ%20Demo";

const integrations = [
  { name: "shopify", label: "shopify" },
  { name: "woo", label: "WooCommerce" },
  { name: "amazon", label: "amazon" },
  { name: "flipkart", label: "Flipkart" },
  { name: "delhivery", label: "DELHIVERY" },
  { name: "bluedart", label: "BLUE DART" }
];

const features = [
  { icon: ShieldCheck, tone: "violet", title: "RTO Risk Prediction", text: "Spot orders that need attention before they turn into avoidable returns.", art: "risk", tag: "PREDICT" },
  { icon: Truck, tone: "blue", title: "Courier Performance", text: "Compare delivery outcomes and understand which partners work best for each lane.", art: "courier", tag: "COMPARE" },
  { icon: MessageCircle, tone: "teal", title: "NDR Analysis", text: "Understand failed delivery reasons and find where follow-ups can make a difference.", art: "ndr", tag: "UNDERSTAND" },
  { icon: Clock3, tone: "amber", title: "Delivery Time Insights", text: "Explore delivery patterns by courier, destination and shipping lane.", art: "delivery", tag: "OPTIMISE" },
  { icon: Wallet, tone: "coral", title: "Cost Optimisation", text: "Make shipping spend easier to understand and identify opportunities to save.", art: "cost", tag: "SAVE" },
  { icon: FileText, tone: "indigo", title: "Custom Reports", text: "Bring the metrics that matter together in a clear view your team can share.", art: "reports", tag: "REPORT" }
];

const useCases = [
  { icon: Boxes, title: "D2C & ecommerce brands", text: "Keep a closer eye on delivery experience, RTO patterns and courier performance.", tone: "lavender" },
  { icon: PackageCheck, title: "Marketplaces", text: "Bring multi-partner shipment performance into one clearer operating picture.", tone: "mint" },
  { icon: BarChart3, title: "Growing enterprises", text: "Give teams a shared view of shipping trends, costs and operational priorities.", tone: "sky" }
];

const faqs = [
  { question: "What is ParcelX IQ?", answer: "ParcelX IQ is an AI-powered shipping intelligence assistant designed to help you explore shipment data, spot patterns and make more informed shipping decisions." },
  { question: "How is it different from a standard dashboard?", answer: "A traditional dashboard displays metrics. ParcelX IQ is designed to help teams explore those metrics in plain language and understand where to look next." },
  { question: "Can ParcelX IQ help analyse RTO and courier performance?", answer: "ParcelX IQ is designed around shipping use cases such as RTO risk, courier performance, NDR analysis, delivery-time trends and shipping cost insights." },
  { question: "Who can use ParcelX IQ?", answer: "It is designed for ecommerce sellers, D2C teams, marketplaces and businesses that want a clearer view of their shipping operations." },
  { question: "How can I get started?", answer: "You can create a ParcelX account or contact the ParcelX team to discuss a product walkthrough." }
];

function ButtonLink({ href, variant = "primary", children, ...props }) {
  return (
    <a className={"iq-button iq-button-" + variant} href={href} {...props}>
      <span>{children}</span><ArrowRight size={16} aria-hidden="true" />
    </a>
  );
}

function HeroDashboard() {
  return (
    <div className="iq-hero-visual">
      <div className="iq-visual-orb iq-visual-orb-one" />
      <div className="iq-visual-orb iq-visual-orb-two" />
      <div className="iq-floating-insight">
        <span className="iq-floating-insight-icon"><Sparkles size={16} /></span>
        <span><b>Insight found</b><small>One clear next step</small></span>
        <ArrowUpRight size={15} />
      </div>
      <div className="iq-dashboard">
        <aside className="iq-dashboard-sidebar">
          <div className="iq-mini-brand"><span className="iq-mini-mark">PX</span><span>ParcelX <b>IQ</b></span></div>
          <div className="iq-new-chat"><span>＋</span> New question</div>
          <div className="iq-side-label">WORKSPACE</div>
          <div className="iq-side-link active"><Sparkles size={14} /> Overview</div>
          <div className="iq-side-link"><BarChart3 size={14} /> Analytics</div>
          <div className="iq-side-link"><Truck size={14} /> Couriers</div>
          <div className="iq-side-link"><PackageCheck size={14} /> Shipments</div>
          <div className="iq-side-link"><FileText size={14} /> Reports</div>
          <div className="iq-sidebar-bottom"><span className="iq-avatar">A</span><span><b>Workspace</b><small>ParcelX account</small></span><ChevronDown size={13} /></div>
        </aside>
        <div className="iq-dashboard-main">
          <div className="iq-dashboard-topline">
            <span>Workspace <b>/ IQ overview</b></span>
            <span className="iq-dashboard-live"><i /> Overview</span>
          </div>
          <div className="iq-dashboard-welcome">
            <div><small>YOUR SHIPPING SNAPSHOT</small><h3>Good morning. Here's your overview.</h3><p>A clearer view of the things moving your business.</p></div>
            <span className="iq-date-chip">Last 30 days⌄</span>
          </div>
          <div className="iq-dashboard-metrics">
            <div className="iq-dashboard-metric metric-violet"><span><PackageCheck size={15} /></span><small>Shipments</small><b>12,480</b><em><TrendingUp size={11} /> 8.2% <i>vs previous period</i></em></div>
            <div className="iq-dashboard-metric metric-mint"><span><CheckCircle2 size={15} /></span><small>Delivered</small><b>11,526</b><em><TrendingUp size={11} /> 4.6% <i>vs previous period</i></em></div>
            <div className="iq-dashboard-metric metric-amber"><span><ShieldCheck size={15} /></span><small>RTO risk flagged</small><b>186</b><em className="metric-neutral">Needs review</em></div>
          </div>
          <div className="iq-dashboard-lower">
            <div className="iq-dashboard-chart">
              <div className="iq-mini-card-heading"><span><b>Shipment performance</b><small>Delivery trend over time</small></span><span className="iq-chart-legend"><i /> Delivered <i /> RTO</span></div>
              <svg viewBox="0 0 520 150" role="img" aria-label="Illustrative shipment performance chart">
                <defs><linearGradient id="iqHeroChartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#7868e8" stopOpacity=".2"/><stop offset="100%" stopColor="#7868e8" stopOpacity="0"/></linearGradient></defs>
                <g stroke="#edf0f4" strokeWidth="1"><path d="M0 25H520M0 62H520M0 99H520M0 136H520"/></g>
                <path d="M0 111 C34 103 48 94 74 99 S115 70 145 83 S187 73 216 62 S264 79 293 54 S340 68 370 42 S416 53 443 31 S485 34 520 18V150H0Z" fill="url(#iqHeroChartFill)"/>
                <path d="M0 111 C34 103 48 94 74 99 S115 70 145 83 S187 73 216 62 S264 79 293 54 S340 68 370 42 S416 53 443 31 S485 34 520 18" fill="none" stroke="#7466df" strokeWidth="3" strokeLinecap="round"/>
                <path d="M0 128 C37 122 56 126 82 121 S131 118 161 122 S209 113 242 119 S286 111 322 116 S380 109 411 114 S477 102 520 108" fill="none" stroke="#39b89b" strokeWidth="2.4" strokeDasharray="5 6" strokeLinecap="round"/>
              </svg>
              <div className="iq-chart-labels"><span>01 Oct</span><span>07 Oct</span><span>14 Oct</span><span>21 Oct</span><span>30 Oct</span></div>
            </div>
            <div className="iq-dashboard-assistant">
              <span className="iq-assistant-mark"><BrainCircuit size={17} /></span>
              <small>PARCELX IQ INSIGHT</small>
              <b>Want to understand a change?</b>
              <p>Ask a question about RTO, couriers or delivery trends.</p>
              <span className="iq-ask-placeholder">Ask ParcelX IQ <Send size={12} /></span>
            </div>
          </div>
        </div>
      </div>
      <div className="iq-visual-footnote"><span><span className="iq-footnote-dot" /> Product preview</span><span>Illustrative interface</span></div>
    </div>
  );
}

function FeatureArt({ type }) {
  if (type === "risk") return (
    <div className="iq-art-scene risk-scene">
      <div className="iq-risk-top"><span>ORDER PX-4821</span><span className="iq-risk-status">Review suggested</span></div>
      <div className="iq-risk-body"><div className="iq-risk-ring"><b>78</b><small>Risk score</small></div><div className="iq-risk-details"><b>Potential RTO risk</b><span><i className="risk-dot dot-purple" /> COD order</span><span><i className="risk-dot dot-amber" /> Address needs review</span><span><i className="risk-dot dot-mint" /> Verification pending</span></div></div>
      <div className="iq-art-bottomline"><span>Order signals</span><div><i style={{width:"74%"}} /></div><b>3 signals</b></div>
    </div>
  );
  if (type === "courier") return (
    <div className="iq-art-scene courier-scene">
      <div className="iq-art-scene-heading"><span>DELIVERY SUCCESS</span><b>Courier comparison</b></div>
      <div className="iq-courier-bars"><div><span className="courier-badge badge-blue">B</span><span className="courier-bar-info"><b>Blue Dart</b><i><em style={{width:"92%"}} /></i></span><strong>92%</strong></div><div><span className="courier-badge badge-violet">D</span><span className="courier-bar-info"><b>Delhivery</b><i><em style={{width:"84%"}} /></i></span><strong>84%</strong></div><div><span className="courier-badge badge-teal">E</span><span className="courier-bar-info"><b>Ekart</b><i><em style={{width:"78%"}} /></i></span><strong>78%</strong></div></div>
      <div className="iq-courier-insight"><TrendingUp size={13} /> Compare performance by lane</div>
    </div>
  );
  if (type === "ndr") return (
    <div className="iq-art-scene ndr-scene">
      <div className="iq-ndr-header"><span>NDR OVERVIEW</span><b>Delivery exception flow</b></div>
      <div className="iq-ndr-flow"><div className="ndr-node"><span><PackageCheck size={16} /></span><b>Failed attempt</b></div><i className="ndr-connector" /><div className="ndr-node"><span><MessageCircle size={16} /></span><b>Customer follow-up</b></div><i className="ndr-connector" /><div className="ndr-node ndr-node-done"><span><Check size={16} /></span><b>Next action</b></div></div>
      <div className="iq-ndr-foot"><span>Understand why deliveries fail</span><ArrowRight size={13} /></div>
    </div>
  );
  if (type === "delivery") return (
    <div className="iq-art-scene delivery-scene">
      <div className="iq-delivery-head"><span>DELIVERY TIMELINE</span><b>Average transit time</b></div>
      <div className="iq-delivery-number"><strong>2.8 <small>days</small></strong><span className="delivery-trend"><TrendingDown size={12} /> Faster this period</span></div>
      <div className="iq-delivery-track"><span className="track-point point-start" /><i /><span className="track-point point-mid" /><i /><span className="track-point point-end" /></div>
      <div className="iq-delivery-labels"><span>Pickup</span><span>In transit</span><span>Delivered</span></div>
      <div className="iq-delivery-note"><Clock3 size={12} /> Explore delivery time by route</div>
    </div>
  );
  if (type === "cost") return (
    <div className="iq-art-scene cost-scene">
      <div className="iq-cost-head"><span>SHIPPING SPEND</span><b>Cost visibility</b></div>
      <div className="iq-cost-chart"><div><i style={{height:"45%"}}/><small>W1</small></div><div><i style={{height:"66%"}}/><small>W2</small></div><div><i style={{height:"54%"}}/><small>W3</small></div><div><i style={{height:"82%"}}/><small>W4</small></div><div><i style={{height:"61%"}}/><small>W5</small></div><div><i style={{height:"38%"}}/><small>W6</small></div></div>
      <div className="iq-cost-foot"><span className="cost-spark"><Zap size={13} /></span><span><b>Find cost-saving opportunities</b><small>Compare cost across couriers and zones</small></span></div>
    </div>
  );
  return (
    <div className="iq-art-scene report-scene">
      <div className="iq-report-sheet">
        <div className="iq-report-head"><span className="report-file-icon"><FileText size={15} /></span><span><b>Shipping report</b><small>Performance summary</small></span><span className="report-menu">•••</span></div>
        <div className="iq-report-stats"><span><b>92.4%</b><small>Delivered</small></span><span><b>12.8%</b><small>RTO rate</small></span><span><b>2.8d</b><small>Avg. transit</small></span></div>
        <div className="iq-report-rows"><i/><i/><i/><i/></div>
      </div>
      <span className="iq-report-float"><CheckCircle2 size={16} /> Ready to share</span>
    </div>
  );
}

function InsightVisual() {
  return (
    <div className="iq-insight-panel">
      <div className="iq-insight-panel-top"><span><span className="iq-window-dot"/><span className="iq-window-dot"/><span className="iq-window-dot"/></span><b>ParcelX IQ <em>Insights</em></b><small>Shipping overview</small></div>
      <div className="iq-insight-main">
        <div className="iq-insight-copy"><span className="iq-mini-eyebrow">MAKE SENSE OF EVERY SHIPMENT</span><h3>See the story behind your shipping data.</h3><p>Bring delivery, courier and return signals into one view, so your team can focus on what needs attention.</p>
          <div className="iq-insight-benefits"><span><CheckCircle2 size={15}/> Unified shipment view</span><span><CheckCircle2 size={15}/> Clear performance trends</span><span><CheckCircle2 size={15}/> Actionable next steps</span></div>
        </div>
        <div className="iq-insight-mini-dashboard">
          <div className="iq-mini-kpis"><div><small>DELIVERY SUCCESS</small><b>92.4%</b><span className="kpi-positive"><TrendingUp size={11}/> Improving</span></div><div><small>RTO RATE</small><b>12.8%</b><span className="kpi-neutral"><Activity size={11}/> Needs review</span></div></div>
          <div className="iq-mini-trend"><div><span><b>Shipment trend</b><small>Illustrative view</small></span><span className="iq-mini-select">30 days⌄</span></div>
            <svg viewBox="0 0 420 130" role="img" aria-label="Illustrative shipment trend"><defs><linearGradient id="iqTrendFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#7868e8" stopOpacity=".2"/><stop offset="1" stopColor="#7868e8" stopOpacity="0"/></linearGradient></defs><g stroke="#edf0f4"><path d="M0 25H420M0 60H420M0 95H420"/></g><path d="M0 105 C35 91 45 87 76 92 S119 67 148 77 S185 63 218 69 S261 41 289 52 S327 33 353 41 S388 20 420 16V130H0Z" fill="url(#iqTrendFill)"/><path d="M0 105 C35 91 45 87 76 92 S119 67 148 77 S185 63 218 69 S261 41 289 52 S327 33 353 41 S388 20 420 16" fill="none" stroke="#7868e8" strokeWidth="3" strokeLinecap="round"/></svg>
          </div>
          <div className="iq-mini-summary"><span><i className="summary-dot violet-dot"/> Delivery trend</span><span><i className="summary-dot mint-dot"/> Return trend</span><span className="iq-summary-tag">Illustrative data</span></div>
        </div>
      </div>
    </div>
  );
}

function ConversationPreview() {
  return (
    <div className="iq-conversation-preview">
      <div className="iq-chat-window-head"><span className="iq-chat-avatar"><BrainCircuit size={18}/></span><span><b>ParcelX IQ</b><small>Shipping intelligence assistant</small></span><span className="iq-online"><i/> Ready</span></div>
      <div className="iq-chat-thread">
        <div className="iq-chat-message user-message"><small>YOU ASKED</small><p>Why is my RTO increasing this month?</p></div>
        <div className="iq-chat-message assistant-message"><span className="iq-chat-bot-icon"><Sparkles size={15}/></span><div><small>PARCELX IQ</small><p>Start by looking at the patterns behind your returns. Here are three useful areas to explore.</p>
          <div className="iq-chat-suggestion"><span className="suggestion-icon suggestion-violet"><Boxes size={14}/></span><span><b>COD order patterns</b><small>Compare return trends across payment types.</small></span><ArrowUpRight size={14}/></div>
          <div className="iq-chat-suggestion"><span className="suggestion-icon suggestion-blue"><Truck size={14}/></span><span><b>Courier performance</b><small>Check for changes by partner and route.</small></span><ArrowUpRight size={14}/></div>
          <div className="iq-chat-suggestion"><span className="suggestion-icon suggestion-teal"><MessageCircle size={14}/></span><span><b>NDR follow-ups</b><small>Review repeat failure reasons and outcomes.</small></span><ArrowUpRight size={14}/></div>
        </div></div>
      </div>
      <div className="iq-chat-input"><Search size={15}/><span>Ask another shipping question...</span><span className="iq-chat-send"><Send size={13}/></span></div>
      <small className="iq-chat-disclaimer">Illustrative conversation preview</small>
    </div>
  );
}

export default function ParcelXIQ() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "ParcelX IQ | Smarter Shipping Intelligence";
    return () => { document.title = previousTitle; };
  }, []);

  return (
    <main className="iq-page">
      <Header />

      <section className="iq-hero" id="top">
        <div className="iq-hero-shell">
          <div className="iq-hero-copy">
            <div className="iq-eyebrow"><span className="iq-eyebrow-icon"><Sparkles size={13}/></span> SHIPPING INTELLIGENCE, REIMAGINED</div>
            <h1>Every shipment tells a story.<br/><span>ParcelX IQ helps you read it.</span></h1>
            <p>Move beyond shipping reports. Ask better questions, understand what is changing and find a clearer next step for your operations.</p>
            <div className="iq-hero-actions"><ButtonLink href={registerUrl}>Get started</ButtonLink><ButtonLink href={demoUrl} variant="secondary">Book a demo</ButtonLink></div>
            <div className="iq-hero-trust"><span><i/> RTO &amp; NDR insights</span><span><i/> Courier performance</span><span><i/> Delivery intelligence</span></div>
          </div>
          <HeroDashboard/>
        </div>
        <div className="iq-hero-bottom"/>
      </section>

      <section className="iq-integrations">
        <div className="iq-section-shell">
          <p className="iq-integrations-title">A CLEARER VIEW ACROSS YOUR COMMERCE &amp; SHIPPING ECOSYSTEM</p>
          <div className="iq-integrations-row">{integrations.map(item=><span className={"iq-brand iq-brand-"+item.name} key={item.name}>{item.label}</span>)}</div>
        </div>
      </section>

      <section className="iq-intro iq-section-shell" id="how-it-works">
        <div className="iq-section-kicker"><span>01</span> FROM DATA TO DECISIONS</div>
        <div className="iq-intro-heading"><h2>Less time searching.<br/><span>More time moving forward.</span></h2><p>Your shipping data holds the answers. ParcelX IQ helps surface the signals, patterns and opportunities that matter to your team.</p></div>
        <div className="iq-intro-grid">
          <article className="iq-intro-card intro-violet"><span className="intro-icon"><Database size={19}/></span><small>01 / CONNECT</small><h3>Bring the picture together</h3><p>Start with a clearer view of shipment and delivery performance across your operations.</p><span className="intro-card-line"/></article>
          <article className="iq-intro-card intro-blue"><span className="intro-icon"><MessageCircle size={19}/></span><small>02 / EXPLORE</small><h3>Ask in your own words</h3><p>Explore RTO, NDR, courier trends and the questions your team needs answered.</p><span className="intro-card-line"/></article>
          <article className="iq-intro-card intro-mint"><span className="intro-icon"><Zap size={19}/></span><small>03 / ACT</small><h3>Know where to focus next</h3><p>Use what you learn to prioritise the decisions that can improve shipping outcomes.</p><span className="intro-card-line"/></article>
        </div>
      </section>

      <section className="iq-intelligence-section">
        <div className="iq-section-shell iq-intelligence-layout">
          <InsightVisual/>
          <div className="iq-intelligence-copy">
            <div className="iq-section-kicker"><span>02</span> YOUR SHIPPING, IN FOCUS</div>
            <h2>See beyond the numbers.<br/><span>Understand what matters.</span></h2>
            <p>ParcelX IQ brings the signals behind your shipments into focus. Explore performance, spot patterns and turn complex data into a more useful conversation.</p>
            <div className="iq-intelligence-points"><div><span className="point-icon point-purple"><Gauge size={17}/></span><span><b>Understand performance</b><small>See the patterns behind key shipping metrics.</small></span></div><div><span className="point-icon point-teal"><Workflow size={17}/></span><span><b>Find operational signals</b><small>Explore where delays, returns and exceptions emerge.</small></span></div><div><span className="point-icon point-blue"><BrainCircuit size={17}/></span><span><b>Make informed decisions</b><small>Focus on the next question worth asking.</small></span></div></div>
          </div>
        </div>
      </section>

      <section className="iq-features-section" id="features">
        <div className="iq-section-shell">
          <div className="iq-section-heading">
            <div><div className="iq-section-kicker"><span>03</span> WHAT YOU CAN EXPLORE</div><h2>One intelligent view.<br/><span>Many ways to move forward.</span></h2><p>Purpose-built perspectives for the everyday questions behind better shipping.</p></div>
            <span className="iq-feature-count">06 <i>CAPABILITIES</i></span>
          </div>
          <div className="iq-feature-grid">
            {features.map(({icon:Icon,title,text,art,tag,tone},index)=><article className={"iq-feature-card feature-"+tone} key={title}>
              <div className="iq-feature-inner">
                <div className={"iq-feature-art art-"+art}><FeatureArt type={art}/><span className="iq-feature-tag">{tag}</span></div>
                <div className="iq-feature-copy"><span className="iq-feature-icon"><Icon size={18}/></span><div><h3>{title}</h3><p>{text}</p></div><ArrowUpRight className="iq-feature-arrow" size={17}/></div>
              </div>
            </article>)}
          </div>
        </div>
      </section>

      <section className="iq-conversation-section">
        <div className="iq-section-shell iq-conversation-layout">
          <div className="iq-conversation-copy">
            <div className="iq-section-kicker"><span>04</span> A MORE NATURAL WAY TO EXPLORE</div>
            <h2>Ask the question.<br/><span>Find the signal.</span></h2>
            <p>Start with what you want to understand. ParcelX IQ is designed to help you explore the right data, discover patterns and decide what deserves attention.</p>
            <div className="iq-conversation-chips"><span>Why is RTO rising?</span><span>Compare my couriers</span><span>Where are delays happening?</span></div>
            <ButtonLink href={registerUrl}>Explore ParcelX IQ</ButtonLink>
          </div>
          <ConversationPreview/>
        </div>
      </section>

      <section className="iq-use-cases iq-section-shell" id="use-cases">
        <div className="iq-section-heading"><div><div className="iq-section-kicker"><span>05</span> BUILT AROUND YOUR BUSINESS</div><h2>Clarity for every shipping team.</h2><p>Useful perspectives for businesses at every stage of their shipping journey.</p></div></div>
        <div className="iq-use-case-grid">{useCases.map(({icon:Icon,title,text,tone})=><article className={"iq-use-card use-"+tone} key={title}><span className="iq-use-icon"><Icon size={21}/></span><div><h3>{title}</h3><p>{text}</p></div><ArrowUpRight size={18}/></article>)}</div>
      </section>

      <section className="iq-testimonial-section">
        <div className="iq-section-shell"><div className="iq-section-kicker"><span>06</span> CUSTOMER STORIES</div><h2>Shipping teams grow with <span>ParcelX.</span></h2><p className="iq-testimonial-intro">Experiences from businesses using the ParcelX shipping platform.</p></div>
        <MainTestimonial/>
      </section>

      <section className="iq-faq-wrap">
        <Faq title={{highlight:"Frequently Asked Questions:",text:" Find answers about ParcelX IQ"}} faqs={faqs}/>
      </section>

      <section className="iq-final-cta-shell iq-section-shell" id="get-started">
        <div className="iq-final-cta">
          <div className="iq-final-cta-orb"/>
          <div className="iq-final-cta-content"><div className="iq-eyebrow iq-eyebrow-light"><Sparkles size={13}/> READY WHEN YOU ARE</div><h2>Make your next shipping decision a smarter one.</h2><p>Bring your shipping questions to ParcelX IQ and see what a clearer picture can unlock.</p><div className="iq-final-actions"><ButtonLink href={registerUrl}>Get started</ButtonLink><ButtonLink href={demoUrl} variant="outline-light">Book a demo</ButtonLink></div></div>
          <div className="iq-final-decoration"><div className="final-orbit final-orbit-a"/><div className="final-orbit final-orbit-b"/><span><BrainCircuit size={45}/></span><i/><i/><i/></div>
        </div>
      </section>

      <Footer/>
    </main>
  );
}
