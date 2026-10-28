import React, { useEffect } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Boxes,
  BrainCircuit,
  CheckCircle2,
  CircleDollarSign,
  ChevronDown,
  Clock3,
  Database,
  FileText,
  MessageCircle,
  PackageCheck,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Truck,
  Zap
} from "lucide-react";
import "../styles/parcelx-iq.css";
import Header from "../includes/Header.jsx";
import Footer from "../includes/Footer.jsx";
import Faq from "../component/Faq.jsx";
import MainTestimonial from "../component/slider/MainTestimonial.jsx";

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
    question: "What is ParcelX IQ?",
    answer: "ParcelX IQ is an AI-powered shipping intelligence assistant that helps you understand shipment data, spot patterns, and make more informed shipping decisions."
  },
  {
    question: "How is it different from a standard dashboard?",
    answer: "Alongside performance metrics, ParcelX IQ is designed to surface insights in plain language so teams can understand what changed, why it matters, and where to look next."
  },
  {
    question: "Can I get insights into RTO and courier performance?",
    answer: "The experience shown here brings together use cases such as RTO risk, courier performance, NDR analysis, delivery-time trends and shipping cost optimisation."
  },
  {
    question: "Who can use ParcelX IQ?",
    answer: "It is designed for e-commerce sellers, D2C teams, marketplaces and businesses that want a clearer view of their shipping operations."
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

function IQConversationVisual() {
  return (
    <div className="iq-conversation-visual">
      <div className="iq-conversation-topbar">
        <span className="iq-conversation-avatar"><Sparkles size={16} /></span>
        <span><b>ParcelX IQ</b><small>Shipping assistant</small></span>
        <span className="iq-conversation-status"><i /> Ready to help</span>
      </div>
      <div className="iq-conversation-thread">
        <div className="iq-user-question">
          <small>YOUR QUESTION</small>
          <p>What should I look into if my RTO is increasing?</p>
        </div>
        <div className="iq-ai-answer">
          <span className="iq-answer-icon"><BrainCircuit size={17} /></span>
          <div className="iq-answer-content">
            <small>IQ INSIGHT</small>
            <p>Start by checking where the change is concentrated. These are useful places to investigate:</p>
            <div className="iq-answer-row"><span className="iq-answer-row-icon orange"><Boxes size={14} /></span><span><b>COD shipments</b><small>Compare return patterns against prepaid orders.</small></span><ArrowUpRight size={15} /></div>
            <div className="iq-answer-row"><span className="iq-answer-row-icon blue"><Truck size={14} /></span><span><b>Courier performance</b><small>Look for changes in delivery outcomes by partner.</small></span><ArrowUpRight size={15} /></div>
            <div className="iq-answer-row"><span className="iq-answer-row-icon green"><FileText size={14} /></span><span><b>NDR reasons</b><small>Review repeat failure reasons and follow-up status.</small></span><ArrowUpRight size={15} /></div>
          </div>
        </div>
      </div>
      <div className="iq-conversation-composer"><Search size={16} /><span>Ask another question...</span><span className="iq-conversation-send"><ArrowRight size={14} /></span></div>
      <div className="iq-conversation-note"><Sparkles size={13} /> Example interface for illustrative purposes</div>
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

      <section className="iq-how-it-works iq-section-shell" id="how-it-works">
        <div className="iq-section-heading iq-steps-heading">
          <div>
            <div className="iq-eyebrow"><Sparkles size={13} /> FROM QUESTION TO CLARITY</div>
            <h2>Less digging through reports.<br /><span>More confident decisions.</span></h2>
            <p>A simple flow for turning everyday shipping questions into the next best action.</p>
          </div>
          <span className="iq-steps-badge"><Zap size={15} /> Built around your workflow</span>
        </div>
        <div className="iq-step-grid">
          <article className="iq-step-card">
            <span className="iq-step-number">01</span>
            <span className="iq-step-icon"><Database size={22} /></span>
            <h3>Bring the data together</h3>
            <p>Start with a clearer view of shipment and delivery performance.</p>
            <span className="iq-step-foot">CONTEXT <ArrowRight size={13} /></span>
          </article>
          <article className="iq-step-card">
            <span className="iq-step-number">02</span>
            <span className="iq-step-icon"><MessageCircle size={22} /></span>
            <h3>Ask in plain language</h3>
            <p>Explore RTO, NDR, courier trends and the questions your team needs answered.</p>
            <span className="iq-step-foot">UNDERSTANDING <ArrowRight size={13} /></span>
          </article>
          <article className="iq-step-card">
            <span className="iq-step-number">03</span>
            <span className="iq-step-icon"><Zap size={22} /></span>
            <h3>Choose your next move</h3>
            <p>Use the patterns you find to decide what deserves attention first.</p>
            <span className="iq-step-foot">ACTION</span>
          </article>
        </div>
      </section>

      <section className="iq-impact-banner">
        <div className="iq-impact-copy">
          <div className="iq-eyebrow iq-eyebrow-dark"><Sparkles size={13} /> SHIPPING INTELLIGENCE, WITHOUT THE SPREADSHEETS</div>
          <h2>Stop chasing numbers.<br /><span>Start finding answers.</span></h2>
          <p>Why is RTO rising? Which courier needs attention? Where are deliveries getting stuck? Ask better questions and turn shipment data into a clearer next move with ParcelX IQ.</p>
          <div className="iq-impact-topics" aria-label="Shipping questions ParcelX IQ can help explore">
            <span><TrendingDown size={13} /> RTO &amp; returns</span>
            <span><Truck size={13} /> Courier performance</span>
            <span><PackageCheck size={13} /> NDR &amp; delivery issues</span>
          </div>
          <ButtonLink href={registerUrl}>Explore ParcelX IQ</ButtonLink>
          <div className="iq-impact-micro"><CheckCircle2 size={14} /> Less report-chasing. More clarity on what to look at next.</div>
        </div>
        <div className="iq-impact-art">
          <IQConversationVisual />
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

      <section className="iq-shared-testimonials" aria-label="ParcelX customer testimonials">
        <div className="iq-section-shell iq-section-heading">
          <div>
            <div className="iq-eyebrow"><Sparkles size={13} /> CUSTOMER STORIES</div>
            <h2>Shipping teams grow with ParcelX</h2>
            <p>Feedback from businesses using the ParcelX shipping platform.</p>
          </div>
        </div>
        <MainTestimonial />
      </section>

      <div className="iq-shared-faq" id="faq">
        <Faq
          title={{
            highlight: "Frequently Asked Questions:",
            text: " Find answers about ParcelX IQ"
          }}
          faqs={faqs}
        />
      </div>

      <section className="iq-final-cta-shell iq-section-shell" id="get-started">
        <div className="iq-final-cta">
          <div className="iq-final-cta-icon"><BarChart3 size={27} /></div>
          <div className="iq-eyebrow iq-eyebrow-dark"><Sparkles size={13} /> READY TO GET STARTED?</div>
          <h2>Turn shipping data into growth with <span>ParcelX IQ</span></h2>
          <p>Get a clearer view of shipping performance and make every decision count.</p>
          <div className="iq-final-actions"><ButtonLink href={registerUrl}>Get Started</ButtonLink><ButtonLink href={demoUrl} variant="outline-dark">Book a Demo</ButtonLink></div>
          <div className="iq-final-line-art" />
        </div>
      </section>

      <Footer
        homeHref={import.meta.env.BASE_URL}
        description="ParcelX IQ turns shipping data into clearer insights, helping e-commerce teams make more informed shipping decisions."
        quickLinks={[
          { label: "Features", href: "#features" },
          { label: "Use Cases", href: "#use-cases" },
          { label: "How it works", href: "#how-it-works" },
          { label: "FAQs", href: "#faq" }
        ]}
        usefulLinks={[
          { label: "ParcelX Website", href: "https://www.parcelx.in/" },
          { label: "Seller Login", href: "https://seller.parcelx.in/" },
          { label: "Get Started", href: registerUrl },
          { label: "Book a Demo", href: demoUrl }
        ]}
      />
    </main>
  );
}

function ActivityIcon() {
  return <TrendingUp size={17} />;
}
