import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Boxes,
  BrainCircuit,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Database,
  FileText,
  Menu,
  MessageCircle,
  PackageCheck,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Truck,
  X,
  Zap
} from "lucide-react";
import "../styles/parcelx-iq.css";
import parcelXLogo from "../images/ParcelX_Logo.svg";

const registerUrl = "https://seller.parcelx.in/register";
const demoUrl = "mailto:hello@parcelx.in?subject=ParcelX%20IQ%20Demo";

const integrations = [
  { name: "shopify", label: "shopify" },
  { name: "Woo", label: "WooCommerce" },
  { name: "magento", label: "M" },
  { name: "amazon", label: "amazon" },
  { name: "flipkart", label: "Flipkart" },
  { name: "delhivery", label: "DELHIVERY" },
  { name: "bluedart", label: "BLUE DART" }
];

const features = [
  {
    icon: ShieldCheck,
    tone: "orange",
    title: "RTO Risk Prediction",
    text: "Identify high-risk orders before they become costly returns."
  },
  {
    icon: BarChart3,
    tone: "blue",
    title: "Courier Performance",
    text: "Compare delivery success, speed and service across couriers."
  },
  {
    icon: FileText,
    tone: "purple",
    title: "NDR Analysis",
    text: "Understand non-delivery reasons and surface the next best action."
  },
  {
    icon: Clock3,
    tone: "green",
    title: "Delivery Time Insights",
    text: "See delivery trends by route, courier and destination."
  },
  {
    icon: CircleDollarSign,
    tone: "amber",
    title: "Cost Optimisation",
    text: "Spot shipping spend patterns and make better courier decisions."
  },
  {
    icon: FileText,
    tone: "pink",
    title: "Custom Reports",
    text: "Turn important shipping metrics into clear, shareable reports."
  }
];

const useCases = [
  {
    icon: Boxes,
    title: "D2C Brands",
    text: "Reduce RTO, improve delivery experience and protect margins."
  },
  {
    icon: PackageCheck,
    title: "Marketplaces",
    text: "Compare courier partners and track performance at scale."
  },
  {
    icon: BarChart3,
    title: "Growing Enterprises",
    text: "Bring shipping data, performance and reporting into one view."
  }
];

const faqs = [
  {
    q: "What is ParcelX IQ?",
    a: "ParcelX IQ is an AI-powered shipping intelligence assistant that helps you understand shipment data, spot patterns, and make more informed shipping decisions."
  },
  {
    q: "How is it different from a standard dashboard?",
    a: "Alongside performance metrics, ParcelX IQ is designed to surface insights in plain language so teams can understand what changed, why it matters, and where to look next."
  },
  {
    q: "Can I get insights into RTO and courier performance?",
    a: "The experience shown here brings together use cases such as RTO risk, courier performance, NDR analysis, delivery-time trends and shipping cost optimisation."
  },
  {
    q: "Who can use ParcelX IQ?",
    a: "It is designed for e-commerce sellers, D2C teams, marketplaces and businesses that want a clearer view of their shipping operations."
  }
];

function ButtonLink({ href, variant = "primary", children, ...props }) {
  return (
    <a className={"iq-button iq-button-" + variant} href={href} {...props}>
      <span>{children}</span>
      {variant === "dark" ? <ArrowUpRight size={17} /> : <ArrowRight size={17} />}
    </a>
  );
}

function DashboardPreview() {
  return (
    <div className="iq-dashboard-scene" aria-label="Illustration of the ParcelX IQ shipping assistant dashboard">
      <div className="iq-orbit iq-orbit-one" />
      <div className="iq-orbit iq-orbit-two" />
      <div className="iq-floating-spark"><Send size={23} /></div>
      <div className="iq-dashboard">
        <aside className="iq-dashboard-sidebar">
          <div className="iq-mini-brand"><span className="iq-mini-mark">PX</span><span>ParcelX <b>IQ</b></span></div>
          <div className="iq-new-chat"><span>＋</span> New Chat</div>
          <div className="iq-side-link active"><Sparkles size={14} /> Home</div>
          <div className="iq-side-link"><BarChart3 size={14} /> Analytics</div>
          <div className="iq-side-link"><Boxes size={14} /> Integrations</div>
          <div className="iq-side-link"><FileText size={14} /> Use Cases</div>
          <div className="iq-side-link"><Database size={14} /> Library</div>
          <div className="iq-side-link"><MessageCircle size={14} /> Help & Support</div>
          <div className="iq-sidebar-bottom"><span className="iq-avatar">A</span><span><b>Ayush</b><small>Workspace</small></span><ChevronDown size={13} /></div>
        </aside>
        <div className="iq-dashboard-main">
          <div className="iq-dashboard-topline"><span className="iq-breadcrumb">ParcelX / <b>IQ Assistant</b></span><span className="iq-live"><i /> Workspace ready</span></div>
          <div className="iq-welcome">
            <span className="iq-ai-pill"><Sparkles size={12} /> AI SHIPPING ASSISTANT</span>
            <p className="iq-greeting">Hi Ayush 👋</p>
            <h3>How can I help you today?</h3>
            <p className="iq-welcome-copy">Ask about shipping trends, RTO risks, courier performance and more.</p>
          </div>
          <div className="iq-prompt-chips">
            <span>Analyse my RTO</span><span>Show pending pickups</span><span>Compare couriers</span>
          </div>
          <div className="iq-chat-composer"><Search size={16} /><span>Ask anything about your shipments...</span><span className="iq-mic">⌁</span><span className="iq-send"><Send size={14} /></span></div>
          <div className="iq-insight-grid">
            <div className="iq-insight-card">
              <span className="iq-card-icon alert"><TrendingDown size={14} /></span>
              <b>RTO Risk Alert</b><small>24 high-risk orders</small><em>View details <ArrowUpRight size={10} /></em>
            </div>
            <div className="iq-insight-card">
              <span className="iq-card-icon good"><CheckCircle2 size={14} /></span>
              <b>Delivery Performance</b><small>On-time: 92%</small><em>View analysis <ArrowUpRight size={10} /></em>
            </div>
            <div className="iq-insight-card">
              <span className="iq-card-icon warn"><Clock3 size={14} /></span>
              <b>Pending Pickups</b><small>18 orders</small><em>View orders <ArrowUpRight size={10} /></em>
            </div>
          </div>
        </div>
      </div>
      <div className="iq-floating-note"><span><Sparkles size={15} /></span><div><b>Get instant answers</b><small>& insights from your data</small></div></div>
    </div>
  );
}

function InsightVisual() {
  return (
    <div className="iq-insight-visual">
      <div className="iq-visual-glow" />
      <div className="iq-visual-topbar"><span className="iq-window-dots"><i /><i /><i /></span><span>ParcelX IQ <b>Insights</b></span><span className="iq-visual-period">Last 30 days⌄</span></div>
      <div className="iq-visual-heading"><div><small>SHIPPING OVERVIEW</small><h3>Good decisions start with good data.</h3></div><span className="iq-visual-mark"><BrainCircuit size={23} /></span></div>
      <div className="iq-stat-row">
        <div className="iq-stat-card"><small>RTO RATE</small><b>12.8%</b><span className="positive"><TrendingDown size={12} /> 3.4% vs last month</span></div>
        <div className="iq-stat-card"><small>DELIVERY SUCCESS</small><b>92.4%</b><span className="positive"><TrendingUp size={12} /> 5.2% vs last month</span></div>
      </div>
      <div className="iq-chart-card">
        <div className="iq-chart-title"><span><b>Shipment outcomes</b><small>Delivery success over time</small></span><span className="iq-chart-legend"><i /> Successful <i /> RTO</span></div>
        <svg className="iq-chart" viewBox="0 0 480 138" role="img" aria-label="Illustrative upward shipment delivery trend">
          <defs><linearGradient id="iqChartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#ff6a26" stopOpacity=".22" /><stop offset="100%" stopColor="#ff6a26" stopOpacity="0" /></linearGradient></defs>
          <g stroke="#edf0f4" strokeWidth="1"><path d="M0 22 H480 M0 54 H480 M0 86 H480 M0 118 H480" /></g>
          <path d="M0 102 C25 93 28 82 52 87 S84 69 105 76 S143 72 162 60 S198 73 220 53 S252 68 277 42 S312 61 333 39 S370 48 394 24 S438 39 480 12 V138 H0Z" fill="url(#iqChartFill)" />
          <path d="M0 102 C25 93 28 82 52 87 S84 69 105 76 S143 72 162 60 S198 73 220 53 S252 68 277 42 S312 61 333 39 S370 48 394 24 S438 39 480 12" fill="none" stroke="#ff641b" strokeWidth="3" strokeLinecap="round" />
          <path d="M0 120 C32 115 42 113 70 118 S122 108 150 114 S201 105 233 112 S277 101 305 109 S369 96 400 104 S449 94 480 99" fill="none" stroke="#8ac9b2" strokeWidth="2.3" strokeLinecap="round" strokeDasharray="4 5" />
        </svg>
        <div className="iq-chart-axis"><span>01 Oct</span><span>07 Oct</span><span>14 Oct</span><span>21 Oct</span><span>30 Oct</span></div>
      </div>
      <div className="iq-visual-bottom">
        <div className="iq-courier-list"><b>Courier performance</b><div><span className="iq-courier-dot orange">B</span><span>Blue Dart</span><strong>94%</strong><i><em style={{ width: "94%" }} /></i></div><div><span className="iq-courier-dot blue">D</span><span>Delhivery</span><strong>89%</strong><i><em style={{ width: "89%" }} /></i></div><div><span className="iq-courier-dot green">F</span><span>Flipkart</span><strong>86%</strong><i><em style={{ width: "86%" }} /></i></div></div>
        <div className="iq-recommendation"><span><Zap size={17} /></span><small>IQ RECOMMENDATION</small><b>Review 18 high-risk COD orders</b><p>Prioritise verification to help reduce avoidable returns.</p><a href="#features">Explore insight <ArrowRight size={12} /></a></div>
      </div>
      <div className="iq-visual-caption"><span><Sparkles size={14} /></span> Your shipping data, made actionable.</div>
    </div>
  );
}

export default function ParcelXIQ() {
  const [openFaq, setOpenFaq] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "ParcelX IQ | Smarter Shipping Intelligence";
    return () => { document.title = previousTitle; };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="iq-page">
      <header className="iq-header">
        <div className="iq-nav-shell">
          <a className="iq-logo" href={import.meta.env.BASE_URL} aria-label="ParcelX home">
            <img src={parcelXLogo} alt="ParcelX" />
            <span className="iq-logo-divider" />
            <span className="iq-logo-product">IQ</span>
          </a>
          <button className="iq-menu-toggle" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <nav className={menuOpen ? "iq-nav-links is-open" : "iq-nav-links"} aria-label="Main navigation">
            <a className="active" href="#top" onClick={closeMenu}>Home</a>
            <a href="#features" onClick={closeMenu}>Features</a>
            <a href="#use-cases" onClick={closeMenu}>Use Cases</a>
            <a href="#integrations" onClick={closeMenu}>Integrations</a>
            <a href="#faq" onClick={closeMenu}>FAQ</a>
            <div className="iq-mobile-nav-actions">
              <a href="https://seller.parcelx.in/" className="iq-button iq-button-light">Login</a>
              <ButtonLink href={registerUrl}>Get Started</ButtonLink>
            </div>
          </nav>
          <div className="iq-nav-actions">
            <a href="https://seller.parcelx.in/" className="iq-button iq-button-light">Login</a>
            <ButtonLink href={registerUrl}>Get Started</ButtonLink>
          </div>
        </div>
      </header>

      <section className="iq-hero" id="top">
        <div className="iq-hero-shell">
          <div className="iq-hero-copy">
            <div className="iq-eyebrow"><Sparkles size={13} /> AI-POWERED LOGISTICS ASSISTANT</div>
            <h1>Smarter shipping<br />starts with <span>ParcelX IQ</span></h1>
            <p className="iq-hero-lede">Your AI-powered shipping assistant to track, analyse and optimise every shipment. Get clearer answers, meaningful insights and smarter recommendations to grow your e-commerce business.</p>
            <div className="iq-hero-actions">
              <ButtonLink href={registerUrl}>Get Started</ButtonLink>
              <ButtonLink href={demoUrl} variant="outline">Book a Demo</ButtonLink>
            </div>
            <div className="iq-hero-stats">
              <div><b>35% <TrendingDown size={17} /></b><span>Lower RTO</span></div>
              <div><b>2X <TrendingUp size={17} /></b><span>Faster decisions</span></div>
              <div><b>100%</b><span>Data-driven insights</span></div>
            </div>
            <p className="iq-micro-note">*Illustrative outcome highlights from the supplied concept reference.</p>
          </div>
          <DashboardPreview />
        </div>
        <div className="iq-hero-bottom-glow" />
      </section>

      <section className="iq-integrations" id="integrations">
        <div className="iq-section-shell">
          <p className="iq-integrations-title">BUILT TO WORK WITH YOUR SHIPPING ECOSYSTEM</p>
          <div className="iq-integrations-row">
            {integrations.map((brand) => <div className={"iq-brand iq-brand-" + brand.name.toLowerCase()} key={brand.name}>{brand.label}</div>)}
            <span className="iq-integrations-more">And more platforms</span>
          </div>
        </div>
      </section>

      <section className="iq-data-section iq-section-shell">
        <InsightVisual />
        <div className="iq-data-copy">
          <div className="iq-eyebrow"><Sparkles size={13} /> WHAT IS PARCELX IQ?</div>
          <h2>Your shipping<br /><span>data assistant</span></h2>
          <p>ParcelX IQ turns shipment information into insights your team can act on. Understand trends, explore courier performance and spot opportunities to improve delivery outcomes.</p>
          <div className="iq-benefit-grid">
            <div><span className="iq-benefit-icon"><Database size={17} /></span><span><b>Unified data view</b><small>Shipping data in one place</small></span></div>
            <div><span className="iq-benefit-icon"><BrainCircuit size={17} /></span><span><b>AI-powered insights</b><small>Find patterns faster</small></span></div>
            <div><span className="iq-benefit-icon"><CheckCircle2 size={17} /></span><span><b>Actionable guidance</b><small>Know where to focus next</small></span></div>
            <div><span className="iq-benefit-icon"><ActivityIcon /></span><span><b>Performance trends</b><small>See how shipping changes</small></span></div>
          </div>
        </div>
      </section>

      <section className="iq-features iq-section-shell" id="features">
        <div className="iq-section-heading">
          <div><div className="iq-eyebrow"><Sparkles size={13} /> KEY FEATURES</div><h2>Everything you need to optimise shipping</h2><p>From shipment risk to courier trends, get the context to make your next move.</p></div>
          <a className="iq-text-link" href="#use-cases">Explore use cases <ArrowRight size={16} /></a>
        </div>
        <div className="iq-feature-grid">
          {features.map(({ icon: Icon, tone, title, text }) => <article className={"iq-feature-card tone-" + tone} key={title}><span className="iq-feature-icon"><Icon size={24} strokeWidth={1.9} /></span><div><h3>{title}</h3><p>{text}</p></div><span className="iq-feature-arrow"><ArrowUpRight size={16} /></span></article>)}
        </div>
      </section>

      <section className="iq-impact-banner">
        <div className="iq-impact-copy">
          <div className="iq-eyebrow iq-eyebrow-dark"><Sparkles size={13} /> TURN DATA INTO ACTION</div>
          <h2>Real insights.<br /><span>Real impact.</span></h2>
          <p>Ask questions, explore shipment analytics and make smarter shipping decisions—all in one place with ParcelX IQ.</p>
          <ButtonLink href={registerUrl}>Get Started</ButtonLink>
        </div>
        <div className="iq-impact-art">
          <InsightVisual />
        </div>
      </section>

      <section className="iq-use-cases iq-section-shell" id="use-cases">
        <div className="iq-section-heading">
          <div><div className="iq-eyebrow"><Sparkles size={13} /> BUILT FOR EVERY BUSINESS</div><h2>Who can use ParcelX IQ?</h2><p>Powerful shipping insights for teams of every size.</p></div>
          <div className="iq-carousel-controls"><button aria-label="Previous audience" type="button" onClick={() => document.getElementById("iq-use-case-cards")?.scrollBy({ left: -320, behavior: "smooth" })}>‹</button><button aria-label="Next audience" type="button" onClick={() => document.getElementById("iq-use-case-cards")?.scrollBy({ left: 320, behavior: "smooth" })}>›</button></div>
        </div>
        <div className="iq-use-case-grid" id="iq-use-case-cards">
          {useCases.map(({ icon: Icon, title, text }, index) => <article className={"iq-use-card iq-use-card-" + index} key={title}><span className="iq-use-icon"><Icon size={22} /></span><div><h3>{title}</h3><p>{text}</p></div><div className="iq-use-illustration" aria-hidden="true"><span /><span /><span /></div></article>)}
        </div>
      </section>

      <section className="iq-proof-section iq-section-shell">
        <div className="iq-testimonial-mark">“</div>
        <div className="iq-testimonial">
          <p>“ParcelX IQ helps bring our shipping performance into focus. The team can see patterns sooner and spend more time acting on insights instead of piecing reports together.”</p>
          <div className="iq-testimonial-person"><span className="iq-testimonial-avatar">RM</span><span><b>Rohit Mehta</b><small>E-commerce business owner</small></span></div>
        </div>
        <div className="iq-proof-metrics">
          <div><span className="iq-proof-icon orange"><ArrowUpRight size={20} /></span><b>28%</b><span>Lower RTO in 2 months*</span></div>
          <div><span className="iq-proof-icon green"><Zap size={20} /></span><b>40%</b><span>Faster issue resolution*</span></div>
          <small>*Figures are presented as sample proof-point content from the design reference, not independently verified results.</small>
        </div>
      </section>

      <section className="iq-faq-cta iq-section-shell" id="faq">
        <div className="iq-faq-panel">
          <div className="iq-eyebrow"><MessageCircle size={13} /> FREQUENTLY ASKED QUESTIONS</div>
          <h2>Find answers to your questions</h2>
          <div className="iq-faq-list">
            {faqs.map((faq, index) => <article className={openFaq === index ? "iq-faq-item is-open" : "iq-faq-item"} key={faq.q}>
              <button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)} aria-expanded={openFaq === index}><span>{faq.q}</span><ChevronDown size={17} /></button>
              {openFaq === index && <p>{faq.a}</p>}
            </article>)}
          </div>
        </div>
        <div className="iq-final-cta">
          <div className="iq-final-cta-icon"><BarChart3 size={27} /></div>
          <div className="iq-eyebrow iq-eyebrow-dark"><Sparkles size={13} /> READY TO GET STARTED?</div>
          <h2>Turn shipping data into growth with <span>ParcelX IQ</span></h2>
          <p>Get a clearer view of shipping performance and make every decision count.</p>
          <div className="iq-final-actions"><ButtonLink href={registerUrl}>Get Started</ButtonLink><ButtonLink href={demoUrl} variant="outline-dark">Book a Demo</ButtonLink></div>
          <div className="iq-final-line-art" />
        </div>
      </section>

      <footer className="iq-footer">
        <div className="iq-footer-inner">
          <div className="iq-footer-brand"><a className="iq-logo" href={import.meta.env.BASE_URL}><img src="/src/images/ParcelX_Logo.svg" alt="ParcelX" /><span className="iq-logo-divider" /><span className="iq-logo-product">IQ</span></a><p>Shipping intelligence that helps your business make better decisions.</p><small>© {new Date().getFullYear()} ParcelX. All rights reserved.</small></div>
          <div className="iq-footer-links"><b>Explore</b><a href="#features">Features</a><a href="#use-cases">Use Cases</a><a href="#integrations">Integrations</a><a href="#faq">FAQs</a></div>
          <div className="iq-footer-links"><b>Get in touch</b><a href={demoUrl}>Book a demo</a><a href="https://seller.parcelx.in/">Login to ParcelX</a><a href="https://www.parcelx.in/">ParcelX website</a></div>
          <a className="iq-footer-top" href="#top" aria-label="Back to top"><ArrowUpRight size={19} /></a>
        </div>
      </footer>
    </main>
  );
}

function ActivityIcon() {
  return <TrendingUp size={17} />;
}
