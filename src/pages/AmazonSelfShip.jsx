import React from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import {
  ArrowUpRight,
  BarChart3,
  Boxes,
  CalendarDays,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  Package,
  PackageCheck,
  RefreshCw,
  ShoppingBag,
  Store,
  Truck,
} from "lucide-react";
import "../styles/shared-faq.css";
import "./AmazonSelfShip.css";
import Header from "../includes/Header.jsx";
import Footer from "../includes/Footer.jsx";
import Faq from "../component/Faq.jsx";
import MainTestimonial from "../component/slider/MainTestimonial.jsx";

const registerUrl = "https://seller.parcelx.in/register";

const workflowSteps = [
  { icon: Store, title: "Connect your amazon seller account", step: "Step 1" },
  { icon: Package, title: "Auto-import Self-Ship orders", step: "Step 2" },
  { icon: ClipboardCheck, title: "Select courier of your choice", step: "Step 3" },
  { icon: CalendarDays, title: "Schedule Pickup & Ship", step: "Step 4" },
  { icon: PackageCheck, title: "Tracking updates synced to Amazon → Delivered", step: "Step 5" }
];

const benefits = [
  { icon: CircleDollarSign, title: "Save more on every shipment", text: "Avoid platform markups and ship at competitive, volume-based rates." },
  { icon: Truck, title: "Freedom to Choose Couriers", text: "Pick the best courier for every order based on cost, speed, or service quality." },
  { icon: Clock3, title: "Faster Dispatch, Better SLAs", text: "Ship orders on your schedule and meet Amazon SLA timelines with ease." },
  { icon: Boxes, title: "One Dashboard, Full Control", text: "Generate labels, track shipments, manage NDRs and billing from one place." },
  { icon: RefreshCw, title: "Reduced RTO & Delivery Failures", text: "Smart courier selection and performance insights help cut returns." },
  { icon: BarChart3, title: "Scales as You Grow", text: "From a few orders to high volumes — no limits, no dependency." }
];

const faqs = [
  { question: "Is there a free trial available?", answer: "Get in touch with the ParcelX team to explore onboarding options and find the right setup for your Amazon Self-Ship workflow." },
  { question: "Can I change my plan later?", answer: "Our team can help review your shipping needs as order volume changes and guide you through the available plan options." },
  { question: "What is your cancellation policy?", answer: "For account or service cancellation requests, contact ParcelX support so the team can review your account and explain the applicable terms." },
  { question: "Can other info be added to an invoice?", answer: "Contact support with your invoicing requirements. The team can confirm which business details can be included on your invoices." },
  { question: "How do I change my account email?", answer: "Reach out to ParcelX support from your registered account and request an email update. The team will help verify and update your details." }
];

const articles = [
  {
    date: "November 20, 2023",
    title: "Choosing the Right Shipping Aggregator: What to Look For",
    text: "Learn what matters most when comparing shipping platforms, from service coverage to tracking, courier choice and transparent rates.",
    image: "https://images.pexels.com/photos/6214474/pexels-photo-6214474.jpeg?auto=compress&cs=tinysrgb&w=1200"
  },
  {
    date: "November 16, 2023",
    title: "Planning Your Move: A Step-by-Step Guide to Success",
    text: "Plan ahead, organise orders and keep every shipment moving with a simple dispatch checklist.",
    image: "https://images.pexels.com/photos/6169056/pexels-photo-6169056.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    date: "November 15, 2023",
    title: "The Art of Efficient Packing: Tips to Make Your Move Easier",
    text: "A few practical packing habits can help protect products and make dispatch more efficient.",
    image: "https://images.pexels.com/photos/4483610/pexels-photo-4483610.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    date: "November 15, 2023",
    title: "Dealing with Kids and Pets: Making Your Move Family-Friendly",
    text: "Simple ways to keep busy days organised while your next delivery is on its way.",
    image: "https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?auto=compress&cs=tinysrgb&w=800"
  }
];

function AmazonBoxArt() {
  return (
    <svg className="ash-box-art" viewBox="0 0 520 390" role="img" aria-label="Open cardboard shipping box">
      <defs>
        <linearGradient id="ash-box-front" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd45b" /><stop offset="1" stopColor="#f4a900" />
        </linearGradient>
        <linearGradient id="ash-box-side" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6b51f" /><stop offset="1" stopColor="#d88900" />
        </linearGradient>
        <linearGradient id="ash-box-flap" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe079" /><stop offset="1" stopColor="#f0a600" />
        </linearGradient>
        <filter id="ash-box-shadow" x="-30%" y="-30%" width="160%" height="180%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>
      <ellipse cx="284" cy="326" rx="169" ry="22" fill="#7d5b1b" opacity=".16" filter="url(#ash-box-shadow)" />
      <path d="M155 137 235 64 313 100 236 164Z" fill="#eda400" />
      <path d="M236 164 313 100 455 128 352 186Z" fill="#e79b00" />
      <path d="M155 137 65 111 168 80 235 112Z" fill="url(#ash-box-flap)" />
      <path d="M235 112 313 100 425 70 455 128 352 186Z" fill="url(#ash-box-flap)" />
      <path d="M155 137 236 164 236 315 155 278Z" fill="url(#ash-box-front)" />
      <path d="M236 164 352 186 352 323 236 315Z" fill="#ffc02b" />
      <path d="M352 186 455 128 449 265 352 323Z" fill="url(#ash-box-side)" />
      <path d="M155 137 236 164 352 186 455 128" fill="none" stroke="#d48a00" strokeWidth="2" opacity=".65" />
      <path d="M197 252 C231 280 283 281 319 258" fill="none" stroke="#27364b" strokeWidth="8" strokeLinecap="round" />
      <path d="M311 257 325 255 319 269" fill="none" stroke="#27364b" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <g transform="translate(381 232)" fill="none" stroke="#704600" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity=".9">
        <path d="M0 0 14 -8 22 5 15 17 4 17" /><path d="M4 17 6 8 M4 17 13 16" /><path d="M22 5 31 -1 31 12" />
      </g>
      <path d="M247 115 352 186" fill="none" stroke="#d78c00" strokeWidth="2" opacity=".5" />
      <path d="M168 80 178 120 235 112" fill="#ffd75a" />
    </svg>
  );
}

function IntegrationPreview() {
  return (
    <div className="ash-dashboard-window" aria-label="Illustrative unified shipping dashboard">
      <div className="ash-dashboard-top">
        <div className="ash-browser-dots"><i /><i /><i /></div>
        <span>Orders &amp; Shipments</span>
        <span className="ash-dashboard-status"><i /> Sync active</span>
      </div>
      <div className="ash-dashboard-toolbar">
        <b>All channels</b><span>Last 7 days⌄</span><button type="button">+ Add Channel</button>
      </div>
      <div className="ash-dashboard-stats">
        <div><small>Total orders</small><b>1,284</b><em>↑ 12.8%</em></div>
        <div><small>Ready to ship</small><b>286</b><em>Today's orders</em></div>
        <div><small>In transit</small><b>498</b><em>Across couriers</em></div>
      </div>
      <div className="ash-channel-list">
        <div className="ash-channel-row">
          <span className="ash-channel-logo ash-channel-amazon">a</span>
          <span><b>Amazon</b><small>Self-Ship orders</small></span><strong>248 orders</strong><span className="ash-connected">Connected</span>
        </div>
        <div className="ash-channel-row">
          <span className="ash-channel-logo ash-channel-shop">S</span>
          <span><b>Shopify</b><small>Store orders</small></span><strong>184 orders</strong><span className="ash-connected">Connected</span>
        </div>
        <div className="ash-channel-row">
          <span className="ash-channel-logo ash-channel-web"><ShoppingBag size={15} /></span>
          <span><b>Website</b><small>Direct orders</small></span><strong>96 orders</strong><span className="ash-connected">Connected</span>
        </div>
      </div>
    </div>
  );
}


const tagOptions = [
  "Parcelx - Cancelled via WhatsApp",
  "Parcelx - Confirmed via IVR",
  "Parcelx - Confirmed via WhatsApp",
  "Parcelx - Cancelled via IVR",
  "ok",
  "releasit_cod_form",
  "bopshop"
];

function AmazonTagMultiSelect() {
  const [selectedTags, setSelectedTags] = React.useState([
    "Parcelx - Confirmed via WhatsApp",
    "Parcelx - Confirmed via IVR"
  ]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [appliedTags, setAppliedTags] = React.useState([]);
  const [searchMessage, setSearchMessage] = React.useState("");
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const toggleTag = (tag) => {
    setSelectedTags((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag]
    );
    setSearchMessage("");
  };

  const removeTag = (event, tag) => {
    event.stopPropagation();
    setSelectedTags((current) => current.filter((item) => item !== tag));
    setSearchMessage("");
  };

  const applySearch = () => {
    if (selectedTags.length === 0) {
      setAppliedTags([]);
      setSearchMessage("Select at least one tag to search.");
      return;
    }
    setAppliedTags([...selectedTags]);
    setIsOpen(false);
    setSearchMessage(
      selectedTags.length === 1
        ? "1 tag selected for search."
        : selectedTags.length + " tags selected for search."
    );
  };

  return (
    <section className="ash-tag-search-section" aria-label="Search shipments by tag">
      <div className="ash-tag-search-inner">
        <label className="ash-tag-search-label" id="ash-tag-search-label">
          Search By Tag
        </label>
        <div className="ash-tag-search-controls">
          <div className="ash-tag-select-wrap" ref={dropdownRef}>
            <div
              className={"ash-tag-select-field" + (isOpen ? " is-open" : "")}
              role="combobox"
              tabIndex={0}
              aria-labelledby="ash-tag-search-label"
              aria-haspopup="listbox"
              aria-expanded={isOpen}
              aria-controls="ash-tag-options"
              onClick={() => setIsOpen((open) => !open)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setIsOpen((open) => !open);
                }
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  setIsOpen(true);
                }
              }}
            >
              <div className="ash-tag-selected-values">
                {selectedTags.length > 0 ? (
                  selectedTags.map((tag) => (
                    <span className="ash-tag-chip" key={tag}>
                      <span>{tag}</span>
                      <button
                        type="button"
                        aria-label={"Remove " + tag}
                        onClick={(event) => removeTag(event, tag)}
                      >
                        <X size={15} strokeWidth={2} />
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="ash-tag-placeholder">Select one or more tags</span>
                )}
              </div>
              <ChevronDown
                className={"ash-tag-chevron" + (isOpen ? " is-open" : "")}
                size={20}
                aria-hidden="true"
              />
            </div>

            {isOpen && (
              <div className="ash-tag-dropdown" id="ash-tag-options">
                <div className="ash-tag-dropdown-top">
                  <span>{selectedTags.length} selected</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTags([]);
                      setSearchMessage("");
                    }}
                    disabled={selectedTags.length === 0}
                  >
                    Clear all
                  </button>
                </div>
                <div className="ash-tag-options-list" role="listbox" aria-multiselectable="true" aria-label="Available tags">
                  {tagOptions.map((tag) => {
                    const selected = selectedTags.includes(tag);
                    return (
                      <button
                        type="button"
                        role="option"
                        aria-selected={selected}
                        className={"ash-tag-option" + (selected ? " is-selected" : "")}
                        key={tag}
                        onClick={() => toggleTag(tag)}
                      >
                        <span>{tag}</span>
                        <span className="ash-tag-option-check">
                          {selected ? <Check size={17} strokeWidth={2.3} /> : null}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="ash-tag-dropdown-bottom">
                  <span>Choose multiple tags</span>
                  <button type="button" onClick={() => setIsOpen(false)}>Done</button>
                </div>
              </div>
            )}
          </div>
          <button
            type="button"
            className="ash-tag-search-button"
            aria-label="Search selected tags"
            title="Search selected tags"
            onClick={applySearch}
          >
            <Search size={21} strokeWidth={2.2} />
          </button>
        </div>
        <div className="ash-tag-search-feedback" aria-live="polite">
          {searchMessage || (appliedTags.length > 0
            ? "Applied: " + appliedTags.join(" · ")
            : "")}
        </div>
      </div>
    </section>
  );
}

export default function AmazonSelfShip() {
  return (
    <main className="amazon-self-ship-page">
      <Header />

      <section className="ash-hero" id="top">
        <div className="ash-hero-shell">
          <div className="ash-hero-copy">
            <h1>Amazon Self Ship : Ship Amazon Self-Ship Orders with ParcelX</h1>
            <p>Take complete control of your Amazon deliveries with flexible couriers, better rates, and real-time tracking.<span className="ash-compliance">— Fully compliant with Amazon Self-Ship</span></p>
            <a className="ash-primary-button" href={registerUrl}>Get Started <ArrowUpRight size={17} /></a>
          </div>
          <div className="ash-hero-visual">
            <AmazonBoxArt />
          </div>
        </div>
        <div className="ash-metrics">
          <div className="ash-metric"><strong>20+</strong><span>Courier Partners</span></div>
          <div className="ash-metric"><strong>100%</strong><span>Tracking Sync Accuracy</span></div>
          <div className="ash-metric"><strong>1000's</strong><span>Countries</span></div>
        </div>
      </section>

      <AmazonTagMultiSelect />

      <section className="ash-media-strip" aria-label="Amazon Self-Ship preview">
        <div className="ash-media-placeholder" />
      </section>

      <section className="ash-workflow" aria-label="How ParcelX Amazon Self-Ship works">
        <div className="ash-workflow-track">
          {workflowSteps.map(({ icon: Icon, title, step }, index) => (
            <article className="ash-workflow-step" key={step}>
              <div className={"ash-workflow-icon ash-workflow-icon-" + index}>
                {index === 0 ? <span className="ash-amazon-a">a<small>⌣</small></span> : <Icon size={36} strokeWidth={1.65} />}
              </div>
              <h3>{title}</h3><span>{step}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="ash-benefits" id="benefits">
        <div className="ash-section-heading">
          <h2>Why Sellers Switch to ParcelX Self-Ship</h2>
        </div>
        <div className="ash-benefit-grid">
          {benefits.map(({ icon: Icon, title, text }) => (
            <article className="ash-benefit-card" key={title}>
              <span className="ash-benefit-icon"><Icon size={20} strokeWidth={1.8} /></span>
              <h3>{title}</h3><p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ash-integration-banner" id="integrations">
        <div className="ash-integration-visual"><IntegrationPreview /></div>
        <div className="ash-integration-copy">
          <span className="ash-integration-kicker"><Boxes size={14} /> CONNECT EVERY CHANNEL</span>
          <h2>One Shipping System for Every Store You Run</h2>
          <p>Connect Amazon, Shopify, and your website into one unified shipping workflow. Manage orders, compare couriers, and keep tracking updates moving from a single place.</p>
          <a href="#benefits" className="ash-integration-button">Explore Integration <ArrowUpRight size={16} /></a>
        </div>
      </section>

      <div className="shared-faq-section ash-faq-section">
        <Faq
          title={{ highlight: "Frequently Asked Question :", text: " Find answers to our most asked questions" }}
          faqs={faqs}
        />
      </div>

      <MainTestimonial />

      <section className="ash-insights" id="insights">
        <div className="ash-insights-heading">
          <h2><span>Shipping Insights:</span> Tips and Tricks for a Smooth Transition</h2>
          <a href="#insights" className="ash-all-insights">All Insights <ArrowUpRight size={15} /></a>
        </div>
        <div className="ash-article-grid">
          <article className="ash-article-card ash-article-feature">
            <img src={articles[0].image} alt="Laptop and packages prepared for an online order" loading="lazy" />
            <div className="ash-article-copy">
              <time>{articles[0].date}</time><h3>{articles[0].title}</h3><p>{articles[0].text}</p>
            </div>
          </article>
          <div className="ash-article-list">
            {articles.slice(1).map((article) => (
              <article className="ash-article-row" key={article.title}>
                <img src={article.image} alt="Shipping packages ready for dispatch" loading="lazy" />
                <div><time>{article.date}</time><h3>{article.title}</h3><p>{article.text}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
