import React,{useMemo,useState} from "react";
import {Search,ArrowRight,ArrowUpRight,Package,Truck,Wallet,Layers3,Plug,Code2,Wrench,MessageCircle,Clock3,FileText,Headphones,ChevronRight,ThumbsUp,ThumbsDown,X,Sparkles,BookOpen,ArrowLeft,CheckCircle2,LifeBuoy} from "lucide-react";
import Header from "../includes/Header.jsx";
import Footer from "../includes/Footer.jsx";
import "./KnowledgeBase.css";
const groups=[
["Getting started","Set up your account and get ready to ship.",Package,"12 guides",["What is ParcelX?","Create your ParcelX account","Complete KYC verification","Add a pickup address","Explore your dashboard"]],
["Orders & shipping","Create shipments and manage every order.",Package,"24 guides",["Create a shipment","Upload orders in bulk","Resolve bulk upload errors","Edit or cancel an order","Generate a shipping label","Understand order statuses"]],
["Courier & delivery","Manage pickups, tracking, NDR and RTO.",Truck,"19 guides",["How courier allocation works","Schedule a pickup","Track a shipment","Understand tracking statuses","Manage an NDR shipment","Understand RTO shipments"]],
["Payments & billing","Wallet, COD remittance, invoices and charges.",Wallet,"14 guides",["Add money to your wallet","View wallet transactions","Understand COD remittance","Download an invoice","Understand shipping charges","Raise a weight dispute"]],
["Products & solutions","Explore the ParcelX product ecosystem.",Layers3,"32 guides",["Explore PaceX delivery","Ship internationally with Videsh","Get started with ParcelX Secure","Configure ParcelX Connect","Set up a custom tracking page","Explore ParcelX Fulfillment","Create an order rule","Set up an automation"]],
["Store integrations","Connect your store and sync orders.",Plug,"11 guides",["Connect your Shopify store","Connect your WooCommerce store","Sync orders with ParcelX","Reconnect a store integration"]],
["Developer documentation","Build with ParcelX APIs and webhooks.",Code2,"Developer portal",["API overview and quickstart","Generate API credentials","API authentication","Create an order using the API","Check serviceability and rates","Track a shipment using the API","Configure webhooks","API errors and response codes"]],
["Troubleshooting","Find solutions to common shipping issues.",Wrench,"18 solutions",["I cannot log in to my account","My order creation failed","My pickup was not attempted","Tracking has not been updated","My COD remittance is delayed","My WhatsApp message was not delivered"]],
["FAQs & support","Quick answers and help from our team.",MessageCircle,"FAQs & help",["Frequently asked questions","Raise a support ticket","Check your ticket status","Contact ParcelX support"]]
];
const popular=["Create a shipment","Upload orders in bulk","Understand COD remittance","Track a shipment","Connect your Shopify store","Manage an NDR shipment"];
export default function KnowledgeBase(){
const [q,Q]=useState(""),[cat,C]=useState(-1),[article,A]=useState(""),[vote,V]=useState("");
const all=useMemo(()=>groups.flatMap((g,i)=>g[4].map(t=>({title:t,category:g[0],id:i}))),[]);
const results=all.filter(x=>(cat<0||x.id===cat)&&(!q||(x.title+" "+x.category).toLowerCase().includes(q.toLowerCase())));
const home=()=>{A("");Q("");C(-1);window.scrollTo(0,0)};
const open=(t)=>{A(t);V("");window.scrollTo(0,0)};
return <div className="pxkb">
<Header />
{article?<main className="kbarticle-page">
  <div className="kbarticle-top"><div className="kbarticle-top-inner">
    <button onClick={home}><ArrowLeft size={15}/> Back to Help Centre</button>
    <span><span>Help Centre</span><ChevronRight size={13}/><span>{groups[cat<0?0:cat][0]}</span></span>
  </div></div>
  <div className="kbarticle-layout">
    <aside className="kbarticle-sidebar">
      <div className="kbside-heading">HELP TOPICS</div>
      {groups.map((g,i)=>{const Icon=g[2];return <button key={g[0]} className={cat===i?"sel":""} onClick={()=>{C(i);A("");window.scrollTo(0,0)}}><Icon size={16}/><span>{g[0]}</span><ChevronRight size={14}/></button>})}
      <div className="kbside-help"><span><LifeBuoy size={18}/></span><b>Need more help?</b><p>Our support team is here when you need us.</p><a href="https://parcelx.in/" target="_blank" rel="noreferrer">Contact support <ArrowUpRight size={13}/></a></div>
    </aside>
    <article className="kbarticle-content">
      <div className="kbarticle-meta"><span className="kbarticle-pill"><BookOpen size={13}/> CUSTOMER GUIDE</span><span><Clock3 size={14}/> 4 min read</span><span className="kbmeta-dot">·</span><span>ParcelX Help Centre</span></div>
      <h1>{article}</h1>
      <p className="kbarticle-lead">Everything you need to know to get started and make the most of ParcelX.</p>
      <div className="kbarticle-rule"></div>
      <div className="kbarticle-draft"><span className="kb-draft-icon"><Sparkles size={19}/></span><div><div className="kb-draft-title">This guide is being prepared</div><p>We're building a clear, step-by-step guide for this topic. The final version will include verified instructions, helpful screenshots and tips from the ParcelX team.</p><span className="kb-draft-status"><span></span> Content review in progress</span></div></div>
      <div className="kbarticle-columns">
        <div className="kbarticle-body">
          <section id="overview"><div className="kb-section-kicker">01 <span>OVERVIEW</span></div><h2>About this guide</h2><p>This article is part of the ParcelX customer knowledge base. It is designed to help you understand the topic, know what you need before you begin, and find the right next step in your shipping workflow.</p></section>
          <section id="what-youll-learn"><div className="kb-section-kicker">02 <span>WHAT YOU'LL LEARN</span></div><h2>What this guide will cover</h2><div className="kb-learn-list"><div><CheckCircle2/><span><b>Understand the feature</b><small>What it does and when you may need it.</small></span></div><div><CheckCircle2/><span><b>Get ready</b><small>Any information or access you may need beforehand.</small></span></div><div><CheckCircle2/><span><b>Follow the workflow</b><small>Clear steps to complete the task in your ParcelX account.</small></span></div><div><CheckCircle2/><span><b>Know what to do next</b><small>Helpful tips and related topics to explore.</small></span></div></div></section>
          <section id="before-you-begin"><div className="kb-section-kicker">03 <span>BEFORE YOU BEGIN</span></div><h2>Before you begin</h2><p>When the detailed instructions are published, make sure you have access to your ParcelX account and the relevant order or account information for this task.</p><div className="kb-info-note"><b>A quick note</b><p>Account-specific settings, charges, eligibility and workflow details will be confirmed against the live ParcelX platform before this guide is marked complete.</p></div></section>
          <div className="kbarticle-feedback"><div><b>Was this page helpful?</b><p>Your feedback helps us make ParcelX guides more useful.</p></div><button className={vote==="yes"?"chosen":""} onClick={()=>V("yes")}><ThumbsUp size={15}/> Yes, helpful</button><button className={vote==="no"?"chosen":""} onClick={()=>V("no")}><ThumbsDown size={15}/> Needs work</button></div>
          {vote&&<div className="kb-feedback-thanks">Thanks for sharing your feedback.</div>}
          <div className="kbarticle-related"><div><small>KEEP EXPLORING</small><h3>Related guides</h3></div><div className="kbarticle-related-grid">{groups[cat<0?0:cat][4].filter(t=>t!==article).slice(0,3).map(t=><button key={t} onClick={()=>open(t)}><FileText size={16}/><span>{t}</span><ArrowUpRight size={15}/></button>)}</div></div>
        </div>
        <nav className="kbarticle-toc"><b>ON THIS PAGE</b><a href="#overview">About this guide</a><a href="#what-youll-learn">What you'll learn</a><a href="#before-you-begin">Before you begin</a><div className="kb-toc-help">Looking for something else?<button onClick={home}>Browse all topics <ArrowRight size={13}/></button></div></nav>
      </div>
    </article>
  </div>
</main>:<><section className="kbhero"><div className="kbwrap kbheroin"><div><small className="kbover">— THE PARCELX KNOWLEDGE HUB</small><h1>Shipping questions?<br/><em>We've got answers.</em></h1><p>Explore step-by-step guides, product explainers and helpful resources to make every shipment simpler.</p><div className="kbsearch"><Search/><input value={q} onChange={e=>{Q(e.target.value);C(-1)}} placeholder="Search articles, topics or questions..."/>{q&&<button onClick={()=>Q("")}><X size={16}/></button>}</div><div className="kbhints">Popular: {["Create an order","COD remittance","Track shipment"].map(t=><button onClick={()=>Q(t)}>{t}</button>)}</div></div><div className="kbvisual"><div className="kbvisualcard"><span>SHIPMENT UPDATE</span><Package/><b>Your order is on its way!</b><i/><i/><i/><small>Moving smoothly with ParcelX</small></div><div className="kbfloat">✓　Need a hand?<small>Find your answer, faster.</small></div><span className="kbspark">✳</span></div></div></section>
<section className="kbwrap kbbody"><div className="kbsection"><div><small>FIND WHAT YOU NEED</small><h2>{q?"Search results":"How can we help you?"}</h2><p>{q?results.length+" matching articles":"Browse by topic and get the most out of ParcelX."}</p></div>{q&&<button className="kbclear" onClick={()=>Q("")}>Clear search</button>}</div>
{(q||cat>=0)?<div className="kbresults">{results.length?results.map(x=><button onClick={()=>{C(x.id);open(x.title)}}><FileText/><span><b>{x.title}</b><small>{x.category}</small></span><ArrowUpRight/></button>):<p className="kbempty">No matching articles yet. Try another search or browse all topics.</p>}</div>:<div className="kbgrid">{groups.map((g,i)=>{const Icon=g[2];return <button className="kbcard" onClick={()=>{C(i);Q("")}}><span className={"kbicon tone"+i}><Icon/></span><b>{g[0]} <ArrowUpRight size={16}/></b><p>{g[1]}</p><small>{g[3]} <strong>Explore <ArrowRight size={13}/></strong></small></button>})}</div>}
{!q&&<><div className="kbsection popularhead"><div><small>QUICK ANSWERS</small><h2>Popular articles</h2><p>Helpful guides ParcelX users visit most.</p></div></div><div className="kbpopular">{popular.map((t,i)=><button onClick={()=>{const found=all.find(x=>x.title===t);C(found?.id??0);open(t)}}><small>0{i+1}　·　GUIDE</small><b>{t}</b><span><Clock3 size={13}/> {i%2?"4":"3"} min read <ArrowUpRight size={15}/></span></button>)}</div><div className="kbdev"><Code2/><div><small>FOR DEVELOPERS</small><b>Building something with ParcelX?</b><p>Explore API references, integration guides and webhook documentation.</p></div><button onClick={()=>C(6)}>Explore developer docs <ArrowRight size={16}/></button></div></>}</section></>}
<section className="kbsupport"><div className="kbwrap"><Headphones/><div><small>STILL NEED A HAND?</small><b>We're always happy to help.</b><p>Couldn't find what you were looking for? Our support team is here for you.</p></div><a href="https://parcelx.in/" target="_blank" rel="noreferrer">Visit ParcelX ↗</a></div></section>
<Footer />
</div>}
