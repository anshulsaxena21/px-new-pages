import React, { useState } from "react";
import { ArrowUpRight, ArrowRight, Check, Boxes, PackageCheck, Warehouse, Truck, RefreshCw, BarChart3, ShieldCheck, Play, Zap, Clock3, MapPin, Headphones, TrendingUp, PanelsTopLeft, Package, FolderHeart, PieChart } from "lucide-react";
import "./Fulfillment.css";
import Header from "../includes/Header.jsx";
import Footer from "../includes/Footer.jsx";
import Faq from "../component/Faq.jsx";
import MainTestimonial from "../component/slider/MainTestimonial.jsx";

const imageAssets = import.meta.glob("../images/fullfillment/*", { eager: true, query: "?url", import: "default" });
const A = (name) => imageAssets[`../images/fullfillment/${name}`] || "";
const features = [
  {icon: Headphones, title:"Support", text:"Seamless assistance whenever you need it from onboarding to daily operations, our team ensures smooth fulfilment without slowdowns."},
  {icon: TrendingUp, title:"Sales", text:"Boost conversions with faster deliveries, lower shipping costs, and smarter fulfilment that helps you sell more, effortlessly."},
  {icon: PanelsTopLeft, title:"Onboarding", text:"Get started quickly with guided setup, effortless integrations, and a zero-stress transition into ParcelX’s fulfilment ecosystem."},
  {icon: Package, title:"Product", text:"Organise, track, and manage your entire product catalogue with precision — from storage to dispatch, every SKU stays in control."},
  {icon: FolderHeart, title:"Quality", text:"Every order is picked, packed, and processed with strict QC checks — ensuring your customers always receive the best."},
  {icon: PieChart, title:"Result", text:"Experience measurable growth through lower RTOs, faster delivery, higher customer satisfaction, and streamlined operations."}
];
const steps = [
  { id: "send-inventory", image: "workflow-send-inventory.svg", title: "Send Inventory", text: "Ship your products to the nearest ParcelX warehouse." },
  { id: "inbound-qc", image: "workflow-inbound-qc.svg", title: "Inbound & QC", text: "We receive, scan and quality-check every SKU." },
  { id: "smart-storage", image: "workflow-smart-storage.svg", title: "Smart Storage", text: "Items are organised and stored with real-time tracking." },
  { id: "order-sync", image: "workflow-order-sync.svg", title: "Order Sync", text: "" },
  { id: "pick-pack", image: "workflow-pick-pack.svg", title: "Pick & Pack", text: "Orders are picked and packed with speed and accuracy." },
  { id: "ship-smart", image: "workflow-ship-smart.svg", title: "Ship Smart", text: "The best courier is auto-assigned for fast, low-cost delivery." },
  { id: "delivered", image: "workflow-delivered.svg", title: "Delivered", text: "Your customer receives the order with real-time updates." }
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

function Image({src,alt,className=""}) { const [failed,setFailed] = useState(false); return failed ? <div className={`image-fallback ${className}`} aria-label={alt}><div className="fallback-grid"><PackageCheck size={56}/><span>ParcelX Fulfillment</span></div></div> : <img className={className} src={src} alt={alt} onError={()=>setFailed(true)}/>; }

export default function Fulfillment(){
 const [openFaq,setOpenFaq] = useState(0);
 return <main className="fulfillment-page">
  <Header />
  <section className="hero section-wrap hero-reference-layout" id="top">
    <div className="hero-copy hero-reference-copy">
      <h1 className="hero-reference-title">Smart, Seamless Warehousing &amp; Fulfillment partner</h1>
      <p className="hero-reference-lede">Store smarter, ship faster, and scale without limits — with ParcelX’s tech-enabled fulfilment, real-time inventory sync, lightning-fast dispatch, and multi-channel order management.</p>
      <div className="hero-actions hero-reference-actions">
        <a className="button button-dark hero-reference-cta" href="https://seller.parcelx.in/register">Get Started <ArrowUpRight size={18}/></a>
      </div>
      <div className="hero-reference-divider" aria-hidden="true"></div>
      <div className="hero-reference-metrics" aria-label="Fulfillment statistics">
        <div className="hero-reference-metric"><strong>500+</strong><p>Global Clients</p></div>
        <div className="hero-reference-metric"><strong>0%</strong><p>Weight Dispute</p></div>
        <div className="hero-reference-metric"><strong>40%</strong><p>Faster Delivery</p></div>
      </div>
    </div>
    <div className="hero-visual hero-reference-visual">
      <Image src={A("fulfillment-hero-warehouse.png")} alt="Warehouse shelving stocked with parcels ready for fulfillment" className="hero-reference-warehouse"/>
    </div>
  </section>
  <section className="benefits section-wrap section-space" id="benefits"><div className="benefits-reference-heading"><h2>The Smarter Way to Store, Sell &amp; Ship</h2><p>Deliver faster, reduce costs, minimise RTOs, and unlock powerful insights — all from our unified platform.</p></div><div className="feature-grid">{features.map(({icon:Icon,title,text})=><article className="feature-card" key={title}><div className="feature-top"><span className="feature-icon"><Icon size={52} strokeWidth={1.45}/></span></div><h3>{title}</h3><p>{text}</p></article>)}</div></section>
  <section className="technology-edge-section" id="technology">
    <Image src={A("fulfillment-technology-background.png")} alt="" className="technology-edge-background"/>
    <div className="technology-edge-art" aria-hidden="true">
      <Image src={A("fulfillment-hero-warehouse.png")} alt="" className="technology-edge-warehouse"/>
      <Image src={A("fulfillment-technology-person-dashboard.png")} alt="" className="technology-edge-person"/>
    </div>
    <div className="technology-edge-copy">
      <h2>Tech That Gives You an Edge</h2>
      <p>Manage everything from one dashboard with real-time order, warehouse and tracking control. AI forecasting keeps inventory ready, while geo-routing speeds deliveries and reduces costs.</p>
      <p>You also get clear insights on sales, courier performance, COD trends and RTO reduction to help you scale smarter.</p>
    </div>
  </section>
  <section className="dashboard-section dashboard-reference-section" id="dashboard">
    <div className="dashboard-reference-copy">
      <h2>Powerful Dashboard for Complete Control</h2>
      <p className="dashboard-reference-intro">Everything you need to manage, track, and scale — in one unified view.</p>
      <div className="dashboard-reference-list">
        <article>
          <h3>Unified Overview</h3>
          <p>All orders, inventory, warehouses, returns, and billing in one dashboard.</p>
        </article>
        <article>
          <h3>Real-Time Inventory</h3>
          <p>Live stock visibility with instant sync and low-stock alerts.</p>
        </article>
        <article>
          <h3>Smart Insights</h3>
          <p>Sales heatmaps, courier performance, COD trends &amp; RTO analytics.</p>
        </article>
        <article>
          <h3>Order Tracking Hub</h3>
          <p>Track every shipment in real time — for you and your customers.</p>
        </article>
      </div>
    </div>
    <div className="dashboard-reference-visual">
      <Image
        src={A("fulfillment-dashboard-laptop.png")}
        alt="ParcelX dashboard on a laptop showing shipping and fulfillment analytics"
        className="dashboard-reference-laptop"
      />
    </div>
  </section>
  <section className="workflow-section" id="workflow">
    <div className="workflow-flow">
      <svg className="workflow-connector" viewBox="0 0 1565 885" preserveAspectRatio="none" aria-hidden="true">
        <path d="M 211 182 H 1428 V 613 H 211" fill="none" stroke="#ffddcc" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {steps.map((step) => (
        <article className={`workflow-flow-node workflow-node-${step.id}`} key={step.id}>
          <img className="workflow-flow-art" src={A(step.image)} alt="" />
          <h3>{step.title}</h3>
          {step.text && <p>{step.text}</p>}
        </article>
      ))}
    </div>
  </section>
  
  
  <MainTestimonial />
  <div className="fulfillment-faq-section">
   <Faq
    title={{
      highlight: "Frequently Asked Question:",
      text: " Find answers to our most asked questions"
    }}
    faqs={faqs}
   />
  </div>

 <Footer />
 </main>;
}