import React, { useEffect } from "react";
import {
  Activity,
  CircleAlert,
  Headset,
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
  Ticket,
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
  { icon: BarChart3, tone: "violet", title: "Shipping Analytics", text: "Explore shipping reports by zone, courier and user to understand performance from the views that matter.", art: "analytics", tag: "ZONE · COURIER · USER" },
  { icon: Ticket, tone: "blue", title: "Ticket Tracking", text: "Keep support tickets organised, follow status updates and see what still needs attention.", art: "tickets", tag: "FOLLOW UP" },
  { icon: Wallet, tone: "teal", title: "Wallet Recharge", text: "Check your shipping wallet and top up your balance when it is time to recharge.", art: "wallet", tag: "RECHARGE" },
  { icon: Truck, tone: "amber", title: "Shipment Tracking", text: "Follow shipment progress and stay informed as parcels move through delivery stages.", art: "tracking", tag: "LIVE STATUS" },
  { icon: CircleAlert, tone: "coral", title: "NDR Escalation", text: "Escalate non-delivery cases that need attention and keep the next follow-up visible.", art: "escalation", tag: "TAKE ACTION" },
  { icon: Headset, tone: "indigo", title: "Support", text: "Find help for shipping, account, wallet and day-to-day operational queries.", art: "support", tag: "WE'RE HERE TO HELP" }
];

const useCases = [
  { icon: Boxes, title: "D2C & ecommerce brands", text: "Keep shipment visibility, ticket follow-ups, wallet activity and support in one connected workflow.", tone: "lavender" },
  { icon: PackageCheck, title: "Marketplaces", text: "Track shipment movement, raise and follow up on tickets, and manage everyday shipping tasks.", tone: "mint" },
  { icon: BarChart3, title: "Growing enterprises", text: "Give teams structured analytics by zone, courier and user, alongside tracking and escalation tools.", tone: "sky" }
];

const faqs = [
  { question: "What can I do with ParcelX IQ?", answer: "ParcelX IQ brings six useful shipping capabilities together: shipping analytics, ticket tracking, wallet recharge, shipment tracking, NDR escalation and support." },
  { question: "What reports are available in Shipping Analytics?", answer: "You can explore shipping analytics through zone-wise, courier-wise and user-wise report views." },
  { question: "Can I track shipments and support tickets?", answer: "ParcelX IQ includes shipment tracking to follow parcel progress and ticket tracking to keep support queries and their updates in view." },
  { question: "Can I recharge my ParcelX wallet through IQ?", answer: "Yes. Use the Wallet Recharge feature to top up your shipping wallet when you need to add funds." },
  { question: "What is NDR Escalation?", answer: "NDR Escalation helps bring non-delivery cases that need further attention into an escalation flow so they can be followed up." },
  { question: "Where can I get help with an issue?", answer: "Use the Support feature to find help for shipping, account, wallet and day-to-day operational queries." }
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
        <span><b>Your operations, connected</b><small>One place to stay in control</small></span>
        <ArrowUpRight size={15} />
      </div>
      <div className="iq-dashboard">
        <aside className="iq-dashboard-sidebar">
          <div className="iq-mini-brand"><span className="iq-mini-mark">PX</span><span>ParcelX <b>IQ</b></span></div>
          <div className="iq-new-chat"><span>＋</span> New question</div>
          <div className="iq-side-label">WORKSPACE</div>
          <div className="iq-side-link active"><Sparkles size={14} /> Overview</div>
          <div className="iq-side-link"><BarChart3 size={14} /> Analytics</div>
          <div className="iq-side-link"><Ticket size={14} /> Tickets</div>
          <div className="iq-side-link"><Wallet size={14} /> Wallet</div>
          <div className="iq-side-link"><PackageCheck size={14} /> Shipments</div>
          <div className="iq-side-link"><Headset size={14} /> Support</div>
          <div className="iq-sidebar-bottom"><span className="iq-avatar">PX</span><span><b>Workspace</b><small>ParcelX account</small></span><ChevronDown size={13} /></div>
        </aside>
        <div className="iq-dashboard-main">
          <div className="iq-dashboard-topline">
            <span>Workspace <b>/ IQ overview</b></span>
            <span className="iq-dashboard-live"><i /> All systems in one view</span>
          </div>
          <div className="iq-dashboard-welcome">
            <div><small>YOUR PARCELX IQ WORKSPACE</small><h3>What would you like to take care of?</h3><p>Quick access to your everyday shipping tasks.</p></div>
            <span className="iq-date-chip">Workspace⌄</span>
          </div>
          <div className="iq-dashboard-metrics iq-workspace-tiles">
            <div className="iq-dashboard-metric metric-violet"><span><BarChart3 size={15} /></span><small>Shipping Analytics</small><b>Reports</b><em className="metric-neutral">Zone · Courier · User</em></div>
            <div className="iq-dashboard-metric metric-mint"><span><Ticket size={15} /></span><small>Ticket Tracking</small><b>Tickets</b><em><CheckCircle2 size={11} /> Status updates</em></div>
            <div className="iq-dashboard-metric metric-amber"><span><Wallet size={15} /></span><small>Wallet Recharge</small><b>Wallet</b><em className="metric-neutral">Manage balance</em></div>
          </div>
          <div className="iq-dashboard-lower">
            <div className="iq-dashboard-chart iq-dashboard-quicklinks">
              <div className="iq-mini-card-heading"><span><b>Manage your shipments</b><small>Quick access</small></span><span className="iq-chart-legend">PARCELX IQ</span></div>
              <div className="iq-quicklink-list">
                <span><i className="quicklink-blue"><Truck size={13}/></i><b>Shipment tracking</b><ArrowUpRight size={12}/></span>
                <span><i className="quicklink-amber"><CircleAlert size={13}/></i><b>NDR escalation</b><ArrowUpRight size={12}/></span>
                <span><i className="quicklink-teal"><Headset size={13}/></i><b>Get support</b><ArrowUpRight size={12}/></span>
              </div>
            </div>
            <div className="iq-dashboard-assistant">
              <span className="iq-assistant-mark"><BrainCircuit size={17} /></span>
              <small>PARCELX IQ</small>
              <b>Need a hand?</b>
              <p>Find the right place to track, manage or get help.</p>
              <span className="iq-ask-placeholder">Explore IQ <ArrowUpRight size={12} /></span>
            </div>
          </div>
        </div>
      </div>
      <div className="iq-visual-footnote"><span><span className="iq-footnote-dot" /> Product preview</span><span>Illustrative interface</span></div>
    </div>
  );
}

function FeatureArt({ type }) {
  if (type === "analytics") return (
    <div className="iq-art-scene analytics-scene">
      <div className="iq-art-scene-heading"><span>REPORT BREAKDOWN</span><b>Shipping analytics</b></div>
      <div className="iq-analytics-tabs"><span className="active">Zone-wise</span><span>Courier-wise</span><span>User-wise</span></div>
      <div className="iq-analytics-chart">
        <div><span>North</span><i><em style={{width:"82%"}}/></i><b>82%</b></div>
        <div><span>West</span><i><em style={{width:"68%"}}/></i><b>68%</b></div>
        <div><span>South</span><i><em style={{width:"74%"}}/></i><b>74%</b></div>
        <div><span>East</span><i><em style={{width:"57%"}}/></i><b>57%</b></div>
      </div>
      <div className="iq-analytics-foot"><span><BarChart3 size={12}/> Compare reports across views</span><ArrowUpRight size={12}/></div>
    </div>
  );
  if (type === "tickets") return (
    <div className="iq-art-scene tickets-scene">
      <div className="iq-ticket-top"><span><Ticket size={14}/> TICKET OVERVIEW</span><small>View all <ArrowUpRight size={11}/></small></div>
      <div className="iq-ticket-item"><span className="ticket-id">#PX-2048</span><b>Pickup request update</b><span className="ticket-status status-progress">In progress</span><small>Last update · Today, 10:42 AM</small></div>
      <div className="iq-ticket-item"><span className="ticket-id">#PX-2036</span><b>Shipment status query</b><span className="ticket-status status-open">Open</span><small>Last update · Today, 09:18 AM</small></div>
      <div className="iq-ticket-footer"><CheckCircle2 size={13}/> Keep every conversation on track</div>
    </div>
  );
  if (type === "wallet") return (
    <div className="iq-art-scene wallet-scene">
      <div className="iq-wallet-top"><span><Wallet size={15}/> SHIPPING WALLET</span><span className="wallet-dots">•••</span></div>
      <div className="iq-wallet-card"><small>WALLET BALANCE</small><strong>Available balance</strong><span>Ready for your next shipment</span><div className="wallet-card-line"><i/><i/><i/></div></div>
      <div className="iq-wallet-actions"><span className="wallet-action-icon"><Wallet size={14}/></span><span><b>Need more balance?</b><small>Recharge your wallet securely</small></span><span className="wallet-recharge">Recharge <ArrowRight size={11}/></span></div>
    </div>
  );
  if (type === "tracking") return (
    <div className="iq-art-scene tracking-scene">
      <div className="iq-tracking-top"><span>SHIPMENT TRACKING</span><span className="tracking-intransit">In transit</span></div>
      <div className="iq-tracking-id"><b>PX123456789</b><small>Shipment status preview</small></div>
      <div className="iq-track-steps">
        <div className="track-step done"><i><Check size={10}/></i><span><b>Order booked</b><small>Shipment created</small></span></div>
        <div className="track-step done"><i><Check size={10}/></i><span><b>Picked up</b><small>Parcel collected</small></span></div>
        <div className="track-step current"><i><Truck size={10}/></i><span><b>In transit</b><small>Moving to destination</small></span></div>
        <div className="track-step"><i><PackageCheck size={10}/></i><span><b>Delivered</b><small>Awaiting delivery</small></span></div>
      </div>
    </div>
  );
  if (type === "escalation") return (
    <div className="iq-art-scene escalation-scene">
      <div className="iq-escalation-head"><span><CircleAlert size={14}/> NDR ESCALATION</span><span className="escalation-count">Needs attention</span></div>
      <div className="iq-escalation-case"><div><b>Delivery attempt unsuccessful</b><small>Order #PX-4812 · Customer unavailable</small></div><span className="escalation-priority">High</span></div>
      <div className="iq-escalation-route"><span className="escalation-route-icon"><MessageCircle size={13}/></span><span><b>Escalation path</b><small>Send case for further action</small></span><ArrowRight size={13}/></div>
      <div className="iq-escalation-progress"><span/><span/><span/></div>
      <div className="iq-escalation-foot">Keep exceptions visible until resolved</div>
    </div>
  );
  return (
    <div className="iq-art-scene support-scene">
      <div className="iq-support-head"><span className="support-agent"><Headset size={16}/></span><span><b>ParcelX Support</b><small><i/> Here to help</small></span><span className="support-more">•••</span></div>
      <div className="iq-support-message">Hi there! What do you need help with today?</div>
      <div className="iq-support-options"><span><Truck size={13}/> Shipment issue <ArrowUpRight size={11}/></span><span><Wallet size={13}/> Wallet query <ArrowUpRight size={11}/></span><span><Ticket size={13}/> Existing ticket <ArrowUpRight size={11}/></span></div>
      <div className="iq-support-input">Write your message... <Send size={12}/></div>
    </div>
  );
}

function InsightVisual() {
  return (
    <div className="iq-insight-panel">
      <div className="iq-insight-panel-top"><span><span className="iq-window-dot"/><span className="iq-window-dot"/><span className="iq-window-dot"/></span><b>ParcelX IQ <em>Analytics</em></b><small>Report preview</small></div>
      <div className="iq-analytics-preview">
        <div className="iq-analytics-preview-copy"><span className="iq-mini-eyebrow">SHIPPING ANALYTICS</span><h3>See your shipping performance from every angle.</h3><p>Move between zone-wise, courier-wise and user-wise reports to understand the details behind your operations.</p></div>
        <div className="iq-analytics-filter-row"><span className="selected">Zone-wise</span><span>Courier-wise</span><span>User-wise</span></div>
        <div className="iq-analytics-report">
          <div className="analytics-report-head"><span><b>Zone-wise overview</b><small>Illustrative report view</small></span><span className="iq-mini-select">All zones⌄</span></div>
          <div className="analytics-report-rows"><div><span>North</span><i><em style={{width:"84%"}}/></i><b>84%</b></div><div><span>West</span><i><em style={{width:"72%"}}/></i><b>72%</b></div><div><span>South</span><i><em style={{width:"77%"}}/></i><b>77%</b></div><div><span>East</span><i><em style={{width:"61%"}}/></i><b>61%</b></div></div>
        </div>
        <div className="iq-analytics-preview-foot"><span><CheckCircle2 size={14}/> Three useful report views</span><span>Zone · Courier · User</span></div>
      </div>
    </div>
  );
}

function ConversationPreview() {
  return (
    <div className="iq-conversation-preview">
      <div className="iq-chat-window-head"><span className="iq-chat-avatar"><BrainCircuit size={18}/></span><span><b>ParcelX IQ</b><small>Shipping intelligence assistant</small></span><span className="iq-online"><i/> Ready</span></div>
      <div className="iq-chat-thread">
        <div className="iq-chat-message user-message"><small>YOU ASKED</small><p>Can you help me check my open support ticket?</p></div>
        <div className="iq-chat-message assistant-message"><span className="iq-chat-bot-icon"><Sparkles size={15}/></span><div><small>PARCELX IQ</small><p>You can use ParcelX IQ to keep ticket updates and follow-ups in view. Here are a few useful shortcuts.</p>
          <div className="iq-chat-suggestion"><span className="suggestion-icon suggestion-violet"><Boxes size={14}/></span><span><b>Ticket status</b><small>Review the latest update on an existing query.</small></span><ArrowUpRight size={14}/></div>
          <div className="iq-chat-suggestion"><span className="suggestion-icon suggestion-blue"><Truck size={14}/></span><span><b>Shipment tracking</b><small>Follow your parcel through delivery stages.</small></span><ArrowUpRight size={14}/></div>
          <div className="iq-chat-suggestion"><span className="suggestion-icon suggestion-teal"><MessageCircle size={14}/></span><span><b>NDR escalation</b><small>Escalate a non-delivery case that needs attention.</small></span><ArrowUpRight size={14}/></div>
        </div></div>
      </div>
      <div className="iq-chat-input"><Search size={15}/><span>Ask for help with a ticket, shipment or wallet...</span><span className="iq-chat-send"><Send size={13}/></span></div>
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
            <div className="iq-eyebrow"><span className="iq-eyebrow-icon"><Sparkles size={13}/></span> YOUR SHIPPING OPERATIONS, CONNECTED</div>
            <h1>Make Your Business<br/><span>Smarter &amp; Easier with AI.</span></h1>
            <p>Turn shipping data into clearer decisions with ParcelX IQ. Explore AI-powered insights through zone-wise, courier-wise and user-wise analytics, while managing shipments, support tickets, wallet recharges and NDR escalations—all in one connected workspace.</p>
            <div className="iq-hero-actions"><ButtonLink href={registerUrl}>Get started</ButtonLink><ButtonLink href={demoUrl} variant="secondary">Book a demo</ButtonLink></div>
            <div className="iq-hero-trust"><span><i/> Zone, courier &amp; user reports</span><span><i/> Shipment &amp; ticket tracking</span><span><i/> Wallet, NDR &amp; support</span></div>
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
        <div className="iq-section-kicker"><span>01</span> YOUR SHIPPING WORKFLOW</div>
        <div className="iq-intro-heading"><h2>Everything you need.<br/><span>Right where you need it.</span></h2><p>From analytics and tracking to wallet recharge, escalations and support, manage everyday shipping tasks from one connected workspace.</p></div>
        <div className="iq-intro-grid">
          <article className="iq-intro-card intro-violet"><span className="intro-icon"><Database size={19}/></span><small>01 / ANALYSE</small><h3>Understand your shipping</h3><p>Open zone-wise, courier-wise and user-wise reports to get a more useful view of shipping performance.</p><span className="intro-card-line"/></article>
          <article className="iq-intro-card intro-blue"><span className="intro-icon"><MessageCircle size={19}/></span><small>02 / TRACK</small><h3>Keep updates in view</h3><p>Follow shipment movement and ticket updates without losing track of what is happening.</p><span className="intro-card-line"/></article>
          <article className="iq-intro-card intro-mint"><span className="intro-icon"><Zap size={19}/></span><small>03 / MANAGE</small><h3>Take care of what is next</h3><p>Recharge your wallet, escalate NDR cases and reach support when you need assistance.</p><span className="intro-card-line"/></article>
        </div>
      </section>

      <section className="iq-intelligence-section">
        <div className="iq-section-shell iq-intelligence-layout">
          <InsightVisual/>
          <div className="iq-intelligence-copy">
            <div className="iq-section-kicker"><span>02</span> SHIPPING ANALYTICS</div>
            <h2>Reports that make sense.<br/><span>Views that work for you.</span></h2>
            <p>Explore your shipping reports in the way that suits your workflow. Switch between zone-wise, courier-wise and user-wise views to understand performance across your operations.</p>
            <div className="iq-intelligence-points"><div><span className="point-icon point-purple"><Gauge size={17}/></span><span><b>Zone-wise reports</b><small>Review performance across shipping zones.</small></span></div><div><span className="point-icon point-teal"><Workflow size={17}/></span><span><b>Courier-wise reports</b><small>Compare shipping activity across courier partners.</small></span></div><div><span className="point-icon point-blue"><BrainCircuit size={17}/></span><span><b>User-wise reports</b><small>See reports through a user-level view.</small></span></div></div>
          </div>
        </div>
      </section>

      <section className="iq-features-section" id="features">
        <div className="iq-section-shell">
          <div className="iq-section-heading">
            <div><div className="iq-section-kicker"><span>03</span> IQ FEATURES · WHAT IQ CAN DO</div><h2>One workspace.<br/><span>Six ways to stay in control.</span></h2><p>Bring your everyday shipping operations together with ParcelX IQ. Explore zone-wise, courier-wise and user-wise analytics, track shipments and support tickets, recharge your wallet, escalate non-delivery cases, and find assistance whenever you need it—all from one connected workspace.</p></div>
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
            <div className="iq-section-kicker"><span>04</span> TICKETS & SUPPORT</div>
            <h2>Every query has a place.<br/><span>Every update stays in view.</span></h2>
            <p>Keep track of support tickets, review updates and find help for shipment, wallet and operational queries from one place.</p>
            <div className="iq-conversation-chips"><span>Check ticket status</span><span>Track a shipment</span><span>Get wallet support</span></div>
            <ButtonLink href={registerUrl}>Explore ParcelX IQ</ButtonLink>
          </div>
          <ConversationPreview/>
        </div>
      </section>

      <section className="iq-use-cases iq-section-shell" id="use-cases">
        <div className="iq-section-heading"><div><div className="iq-section-kicker"><span>05</span> BUILT AROUND YOUR BUSINESS</div><h2>Clarity for every shipping team.</h2><p>A connected workspace for ecommerce teams managing shipments, reports and day-to-day shipping operations.</p></div></div>
        <div className="iq-use-case-grid">{useCases.map(({icon:Icon,title,text,tone})=><article className={"iq-use-card use-"+tone} key={title}><span className="iq-use-icon"><Icon size={21}/></span><div><h3>{title}</h3><p>{text}</p></div><ArrowUpRight size={18}/></article>)}</div>
      </section>

      <section className="iq-testimonial-section">
        <div className="iq-section-shell"><div className="iq-section-kicker"><span>06</span> CUSTOMER STORIES</div><h2>Shipping teams grow with <span>ParcelX.</span></h2><p className="iq-testimonial-intro">Stories from businesses managing their shipping operations with ParcelX.</p></div>
        <MainTestimonial/>
      </section>

      <section className="iq-faq-wrap">
        <Faq title={{highlight:"Frequently Asked Questions:",text:" Find answers about ParcelX IQ"}} faqs={faqs}/>
      </section>

      <section className="iq-final-cta-shell iq-section-shell" id="get-started">
        <div className="iq-final-cta">
          <div className="iq-final-cta-orb"/>
          <div className="iq-final-cta-content"><div className="iq-eyebrow iq-eyebrow-light"><Sparkles size={13}/> READY WHEN YOU ARE</div><h2>Keep every shipping task moving with ParcelX IQ.</h2><p>Analyse reports, track shipments and tickets, manage wallet recharge, escalate NDR cases and get support—all in one place.</p><div className="iq-final-actions"><ButtonLink href={registerUrl}>Get started</ButtonLink><ButtonLink href={demoUrl} variant="outline-light">Book a demo</ButtonLink></div></div>
          <div className="iq-final-decoration"><div className="final-orbit final-orbit-a"/><div className="final-orbit final-orbit-b"/><span><BrainCircuit size={45}/></span><i/><i/><i/></div>
        </div>
      </section>

      <Footer/>
    </main>
  );
}
