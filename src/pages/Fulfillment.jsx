import React, { useState } from "react";
import { ArrowUpRight, ArrowRight, Check, Boxes, PackageCheck, Warehouse, Truck, RefreshCw, BarChart3, ShieldCheck, Play, Zap, Clock3, MapPin, Headset } from "lucide-react";
import "./Fulfillment.css";
import Header from "../includes/Header.jsx";
import Footer from "../includes/Footer.jsx";
import Faq from "../component/Faq.jsx";

const imageAssets = import.meta.glob("../images/fullfillment/*", { eager: true, query: "?url", import: "default" });
const A = (name) => imageAssets[`../images/fullfillment/${name}`] || "";
const features = [
  {icon: Headset, title:"Human support, always", text:"A team that understands your operations and helps you keep orders moving."},
  {icon: BarChart3, title:"More room to grow", text:"Scale order volumes without scaling the complexity of your operations."},
  {icon: Zap, title:"Quick onboarding", text:"Connect your store and get your fulfilment workflow up and running smoothly."},
  {icon: Boxes, title:"Inventory in control", text:"Keep stock organised with visibility into inventory across every stage."},
  {icon: ShieldCheck, title:"Quality at every step", text:"Reliable checks, accurate packing and fewer avoidable fulfilment errors."},
  {icon: PackageCheck, title:"Outcomes that matter", text:"Build a better post-purchase experience with dependable operations."}
];
const steps = [
  ["01","Send inventory","Send your products to a ParcelX fulfilment centre."],
  ["02","Inbound & QC","Inventory is received, scanned and quality checked."],
  ["03","Smart storage","Products are organised for accurate, efficient picking."],
  ["04","Order sync","Orders flow into fulfilment from your connected store."],
  ["05","Pick & pack","Every order is picked and packed with care."],
  ["06","Ship smart","Courier allocation helps balance speed and cost."],
  ["07","Delivered","Your customer gets the order and tracking updates."]
];
const faqs = [
  {
    question: "What is ParcelX PaceX?",
    answer: "ParcelX PaceX is a premium fast delivery service designed for businesses that need quick and reliable shipping. It offers Same Day Delivery (SDD) and Next Day Delivery (NDD), helping you deliver orders faster, improve customer satisfaction, and stay ahead in a competitive market."
  },
  {
    question: "Who should use ParcelX PaceX?",
    answer: "ParcelX PaceX is ideal for e-commerce businesses, D2C brands, and sellers who need reliable same-day or next-day delivery to meet urgent customer expectations."
  },
  {
    question: "How fast are orders processed?",
    answer: "Orders are processed quickly so eligible shipments can be dispatched for Same Day Delivery (SDD) or Next Day Delivery (NDD), depending on serviceability, pickup timing, and the selected courier partner."
  },
  {
    question: "Can I choose courier partners for fast delivery?",
    answer: "Available courier partners depend on pickup and delivery pincodes and service requirements. ParcelX helps you choose a suitable option for fast, reliable delivery."
  }
];
const articles = [
  ["FULFILMENT GUIDE","A smarter way to manage e-commerce orders","Learn how connected fulfilment can simplify everyday operations.","fulfillment-hero-warehouse.png"],
  ["OPERATIONS","Make every shipment work harder","Small improvements in packing and dispatch can make a big difference.","fulfillment-dashboard-laptop.png"],
  ["GROWTH","Build a better delivery experience","Create a smoother journey from checkout to customer doorstep.","fulfillment-technology-background.png"]
];
function Image({src,alt,className=""}) { const [failed,setFailed] = useState(false); return failed ? <div className={`image-fallback ${className}`} aria-label={alt}><div className="fallback-grid"><PackageCheck size={56}/><span>ParcelX Fulfillment</span></div></div> : <img className={className} src={src} alt={alt} onError={()=>setFailed(true)}/>; }

export default function Fulfillment(){
 const [openFaq,setOpenFaq] = useState(0);
 return <main className="fulfillment-page">
  <Header />
  <section className="hero section-wrap" id="top"><div className="hero-copy"><div className="eyebrow"><span className="eyebrow-dot"></span> FULFILLMENT, REIMAGINED</div><h1>From your warehouse<br/>to their <span>happy place.</span></h1><p className="hero-lede">E-commerce fulfillment that keeps your operations moving. Store smarter, ship faster, and give every order the experience it deserves.</p><div className="hero-actions"><a className="button button-dark" href="#contact">Get started <ArrowUpRight size={18}/></a><a className="text-link" href="#workflow"><span className="play-circle"><Play size={13} fill="currentColor"/></span> See how it works</a></div><div className="hero-trust"><div className="avatar-stack"><span>A</span><span>P</span><span>S</span><span>+</span></div><p><strong>Built for ambitious brands</strong><br/>From first order to next-level growth</p></div></div><div className="hero-visual"><div className="hero-image-frame"><Image src={A("fulfillment-hero-warehouse.png")} alt="Organised warehouse shelving and fulfillment operations" className="hero-image"/><div className="image-label"><span className="live-dot"></span><div><strong>Orders in motion</strong><small>One connected workflow</small></div><ArrowUpRight size={18}/></div></div><div className="floating-card floating-top"><span className="floating-icon"><PackageCheck size={19}/></span><div><strong>Order ready</strong><small>Picked & packed</small></div><Check size={17} className="green-check"/></div><div className="floating-card floating-bottom"><span className="floating-icon orange"><Truck size={19}/></span><div><strong>On the way</strong><small>Shipping made smarter</small></div></div><div className="hero-orbit"></div></div></section>
  <section className="metrics section-wrap"><div className="metric-intro">A stronger operation.<br/><span>Better customer moments.</span></div><div className="metric"><strong>500<span>+</span></strong><p>Global clients</p></div><div className="metric"><strong>0<span>%</span></strong><p>Weight dispute goal</p></div><div className="metric"><strong>40<span>%</span></strong><p>Faster delivery potential</p></div></section>
  <section className="benefits section-wrap section-space" id="benefits"><div className="section-heading"><div><div className="eyebrow">THE PARCELX ADVANTAGE</div><h2>All the moving parts.<br/><span>Moving together.</span></h2></div><p>Fulfillment shouldn’t slow your business down. Bring inventory, orders and shipping into one thoughtful, connected flow.</p></div><div className="feature-grid">{features.map(({icon:Icon,title,text},i)=><article className="feature-card" key={title}><div className="feature-top"><span className="feature-icon"><Icon size={22}/></span><span className="feature-number">0{i+1}</span></div><h3>{title}</h3><p>{text}</p><span className="feature-arrow"><ArrowUpRight size={17}/></span></article>)}</div></section>
  <section className="workflow-section section-space" id="workflow"><div className="section-wrap"><div className="section-heading"><div><div className="eyebrow">SIMPLE BY DESIGN</div><h2>One flow. <span>Seven steps.</span></h2></div><p>From inbound inventory to doorstep delivery, each step is designed to keep the whole journey clear.</p></div><div className="workflow-track">{steps.map(([n,title,text])=><article className="workflow-step" key={n}><div className="step-top"><span>{n}</span><div className="step-icon">{[<Warehouse/>,<ShieldCheck/>,<Boxes/>,<RefreshCw/>,<PackageCheck/>,<Truck/>,<MapPin/>][Number(n)-1]}</div></div><h3>{title}</h3><p>{text}</p></article>)}</div><div className="workflow-note"><span><Check size={17}/></span> Clear visibility from inventory intake to final delivery.</div></div></section>
  <section className="technology-section section-space" id="technology"><div className="section-wrap technology-layout"><div className="technology-copy"><div className="eyebrow">TECHNOLOGY THAT WORKS FOR YOU</div><h2>Less guesswork.<br/><span>More getting-things-done.</span></h2><p>Make informed decisions with connected tools that bring your inventory, orders and fulfilment activity into view.</p><ul><li><Check/> Visibility across your fulfillment workflow</li><li><Check/> A more organised inventory operation</li><li><Check/> A smoother path from order to dispatch</li></ul><a className="button button-dark" href="#contact">Explore fulfillment <ArrowUpRight size={18}/></a></div><div className="technology-visual"><div className="tech-glow"></div><Image src={A("fulfillment-technology-person-dashboard.png")} alt="Fulfillment team member using a dashboard" className="tech-person"/><div className="dashboard-card"><div className="dashboard-top"><span>FULFILLMENT OVERVIEW</span><span className="dashboard-status">● Live view</span></div><div className="dashboard-title">Operations at a glance</div><div className="dashboard-stats"><div><small>Orders processed</small><strong>2,480</strong><em>↗ On track</em></div><div><small>Inventory status</small><strong>98.4%</strong><em>↗ In sync</em></div></div><div className="chart-bars">{[35,52,43,68,54,77,63,88,72,95,81,100].map((h,i)=><i key={i} style={{height:h+"%"}}/>)}</div><div className="chart-labels"><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span></div></div><div className="tech-badge"><span><Zap size={16}/></span> Smarter by design</div></div></div></section>
  <section className="dashboard-section section-space"><div className="section-wrap dashboard-layout"><div className="dashboard-visual"><div className="dashboard-halo"></div><Image src={A("fulfillment-dashboard-laptop.png")} alt="ParcelX fulfillment dashboard on a laptop" className="laptop-image"/><div className="dashboard-mini"><span className="mini-check"><Check size={15}/></span><div><strong>Inventory synced</strong><small>Everything in its place</small></div></div></div><div className="dashboard-copy"><div className="eyebrow">YOUR BUSINESS, IN FOCUS</div><h2>Know what’s happening.<br/><span>And what’s next.</span></h2><p>When the details are easier to see, it’s easier to make the next move. Bring your fulfilment activity into a clearer view and keep your team aligned.</p><div className="dashboard-points"><div><span><Clock3/></span><div><strong>Stay in the loop</strong><p>Keep track of the work moving through your operation.</p></div></div><div><span><BarChart3/></span><div><strong>Make confident decisions</strong><p>Use operational visibility to plan your next stage of growth.</p></div></div></div><a className="text-link orange-link" href="#contact">Let’s talk about your needs <ArrowRight size={17}/></a></div></div></section>
  <section className="testimonial-section section-space"><div className="section-wrap testimonial-inner"><div className="testimonial-mark">“</div><div className="eyebrow">BUILT AROUND YOUR GROWTH</div><blockquote>“Great fulfillment is the kind your customer never has to think about — it just works.”</blockquote><div className="testimonial-bottom"><div className="testimonial-avatar">PX</div><div><strong>ParcelX Fulfillment</strong><p>Helping brands deliver better experiences</p></div><div className="testimonial-stars">★★★★★</div></div></div></section>
  <div className="fulfillment-faq-section">
   <Faq
    title={{
      highlight: "Frequently Asked Question:",
      text: " Find answers to our most asked questions"
    }}
    faqs={faqs}
   />
  </div>
  <section className="resources-section section-space" id="resources"><div className="section-wrap"><div className="section-heading"><div><div className="eyebrow">THE PARCELX JOURNAL</div><h2>Ideas for your <span>next move.</span></h2></div><a className="text-link orange-link" href="#contact">Explore more insights <ArrowRight size={17}/></a></div><div className="article-grid">{articles.map(([tag,title,desc,img],i)=><article className="article-card" key={title}><div className="article-image"><Image src={A(img)} alt="" className="article-photo"/><span className="article-index">0{i+1}</span></div><div className="article-content"><div className="article-tag">{tag}</div><h3>{title}</h3><p>{desc}</p><a href="#contact" aria-label={`Learn more: ${title}`}><ArrowUpRight size={18}/></a></div></article>)}</div></div></section>
  <section className="contact-section section-wrap" id="contact"><div className="contact-panel"><div className="contact-decoration decoration-one"></div><div className="contact-decoration decoration-two"></div><div className="contact-content"><div className="eyebrow light-eyebrow"><span></span> READY WHEN YOU ARE</div><h2>Let’s get your<br/>orders moving.</h2><p>Tell us where you want to go. We’ll help you explore a fulfillment setup that fits your business.</p><a className="button button-light" href="https://parcelx.in/" target="_blank" rel="noreferrer">Talk to ParcelX <ArrowUpRight size={18}/></a></div><div className="contact-art"><div className="contact-box box-back"></div><div className="contact-box box-front"><span>PX</span><div className="box-tape"></div></div><div className="contact-ring ring-one"></div><div className="contact-ring ring-two"></div></div></div></section>
  
 <Footer />
 </main>;
}