import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BadgeCheck, BarChart3, CheckCircle2, Headset, Layers3, LoaderCircle, LockKeyhole, PackageCheck, Sparkles, Ticket, Truck, Wallet } from "lucide-react";
import logo from "../images/ParcelX_Logo.svg";
import "../styles/parcelx-iq-demo.css";

const inboxEndpoint = "https://formsubmit.co/ajax/parcelxsocial@gmail.com";
const productUrl = "https://anshulsaxena21.github.io/px-new-pages/parcelx-iq-product.html";
const intentCopy = {
  demo: { eyebrow: "PRODUCT WALKTHROUGH", title: "See what ParcelX IQ can do for your business.", description: "Share five quick details and the IQ team can take you through the product." },
  standalone: { eyebrow: "STANDALONE IQ WORKSPACE", title: "Let's explore your own IQ workspace.", description: "Share five quick details to start a conversation about your dedicated shipping intelligence workspace." },
  embedded: { eyebrow: "EMBEDDED IQ EXPERIENCE", title: "Bring IQ into your own seller experience.", description: "Share five quick details to start a conversation about an embedded IQ experience." },
  integration: { eyebrow: "INTEGRATION ENQUIRY", title: "Let's talk about your integration needs.", description: "Share five quick details and the IQ team can connect with you about integration." },
  question: { eyebrow: "TALK TO THE IQ TEAM", title: "Let's talk about ParcelX IQ.", description: "Share five quick details and the IQ team can help with your questions." }
};

function Field({ label, children, wide = false }) {
  return (
    <label className={"iqd-field" + (wide ? " iqd-field-wide" : "")}>
      <span className="iqd-label">{label}<i>*</i></span>
      {children}
    </label>
  );
}

export default function ParcelXIQDemo() {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const initialIntent = params.get("intent") || "demo";
  const copy = intentCopy[initialIntent] || intentCopy.demo;
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    brand_name: "",
    monthly_orders: ""
  });
  const [status, setStatus] = useState("idle");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduceMotion) return undefined;

    const root = document.querySelector(".iqd-page");
    const aura = root?.querySelector(".iqd-cursor-aura");
    const formCard = root?.querySelector(".iqd-form-card");
    const magnetic = root?.querySelector(".iqd-form-submit button");
    if (!root || !aura) return undefined;

    const onPointerMove = (event) => {
      if (event.pointerType !== "mouse") return;
      aura.style.setProperty("--iqd-cursor-x", event.clientX + "px");
      aura.style.setProperty("--iqd-cursor-y", event.clientY + "px");
      aura.classList.add("is-visible");

      if (formCard) {
        const rect = formCard.getBoundingClientRect();
        formCard.style.setProperty("--iqd-pointer-x", (event.clientX - rect.left) + "px");
        formCard.style.setProperty("--iqd-pointer-y", (event.clientY - rect.top) + "px");
        formCard.classList.toggle("is-pointer-near", event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom);
      }

      if (magnetic && event.target.closest(".iqd-form-submit button") === magnetic) {
        const rect = magnetic.getBoundingClientRect();
        const nx = (event.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const ny = (event.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        magnetic.style.setProperty("--iqd-magnetic-x", (Math.max(-1, Math.min(1, nx)) * 5).toFixed(2) + "px");
        magnetic.style.setProperty("--iqd-magnetic-y", (Math.max(-1, Math.min(1, ny)) * 3).toFixed(2) + "px");
        magnetic.classList.add("iqd-magnetic-active");
      } else if (magnetic) {
        magnetic.style.removeProperty("--iqd-magnetic-x");
        magnetic.style.removeProperty("--iqd-magnetic-y");
        magnetic.classList.remove("iqd-magnetic-active");
      }
    };

    const onPointerLeave = () => {
      aura.classList.remove("is-visible");
      formCard?.classList.remove("is-pointer-near");
      if (magnetic) {
        magnetic.style.removeProperty("--iqd-magnetic-x");
        magnetic.style.removeProperty("--iqd-magnetic-y");
        magnetic.classList.remove("iqd-magnetic-active");
      }
    };

    root.addEventListener("pointermove", onPointerMove, { passive: true });
    root.addEventListener("pointerleave", onPointerLeave);
    return () => {
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  function update(event) {
    const { name, value } = event.target;
    setValues(current => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setStatusMessage("");

    const payload = {
      ...values,
      _subject: "New ParcelX IQ enquiry — " + copy.eyebrow,
      _template: "table",
      _honey: "",
      _url: window.location.href,
      product: "ParcelX IQ",
      enquiry_type: copy.eyebrow
    };

    try {
      const response = await fetch(inboxEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json().catch(() => ({}));
      const accepted = response.ok && (result.success === true || result.success === "true");
      if (!accepted) throw new Error(result.message || "We couldn't send your request just now. Please try again.");
      setStatus("success");
      setStatusMessage("Your request has been submitted. The ParcelX IQ team will review the details and get in touch.");
    } catch (error) {
      setStatus("error");
      setStatusMessage(error?.message || "Something went wrong. Please try again.");
    }
  }

  function resetForm() {
    setValues({ name: "", email: "", phone: "", brand_name: "", monthly_orders: "" });
    setStatus("idle");
    setStatusMessage("");
  }

  return (
    <main className="iqd-page">
      <div className="iqd-cursor-aura" aria-hidden="true"><span /></div>
      <header className="iqd-header">
        <a className="iqd-brand" href={productUrl} aria-label="Back to ParcelX IQ">
          <img src={logo} alt="ParcelX" /><span /><b>IQ</b>
        </a>
        <a className="iqd-back" href={productUrl}><ArrowLeft size={15} /> Back to ParcelX IQ</a>
      </header>

      <section className="iqd-main">
        <div className="iqd-intro">
          <div className="iqd-kicker"><span><Sparkles size={13} /></span> {copy.eyebrow}</div>
          <h1>{copy.title}</h1>
          <p>{copy.description}</p>
          <div className="iqd-benefits">
            <div><span className="benefit-violet"><BarChart3 size={17} /></span><b>Shipping insights</b><small>Zone, courier & user views</small></div>
            <div><span className="benefit-blue"><Truck size={17} /></span><b>Operational visibility</b><small>Shipments, tickets & NDR</small></div>
            <div><span className="benefit-teal"><Layers3 size={17} /></span><b>Flexible adoption</b><small>Standalone or embedded</small></div>
          </div>
          <div className="iqd-product-note">
            <div className="iqd-note-icon"><LockKeyhole size={17} /></div>
            <div><b>Built around your workflow</b><p>Just the essentials. The IQ team will use these details to follow up about your enquiry.</p></div>
          </div>
          <div className="iqd-capability-strip">
            <span><BarChart3 size={13} /> Analytics</span><span><Ticket size={13} /> Tickets</span><span><Wallet size={13} /> Wallet</span><span><PackageCheck size={13} /> Tracking</span><span><Headset size={13} /> Support</span>
          </div>
        </div>

        <div className="iqd-form-card">
          <div className="iqd-form-head">
            <div><span>LET'S GET STARTED</span><h2>Request your IQ walkthrough</h2><p>Just five quick details to get started.</p></div>
            <span className="iqd-form-spark"><Sparkles size={20} /></span>
          </div>

          {status === "success" ? (
            <div className="iqd-success" role="status">
              <span><CheckCircle2 size={30} /></span>
              <h3>Request received.</h3>
              <p>{statusMessage}</p>
              <div className="iqd-success-next"><BadgeCheck size={16} /> Your enquiry is marked for the ParcelX IQ team.</div>
              <button type="button" onClick={resetForm}>Submit another enquiry <ArrowRight size={15} /></button>
              <a href={productUrl}>Return to ParcelX IQ <ArrowLeft size={14} /></a>
            </div>
          ) : (
            <form className="iqd-form" onSubmit={handleSubmit}>
              <div className="iqd-form-grid">
                <Field label="Name">
                  <input name="name" autoComplete="name" value={values.name} onChange={update} placeholder="Your full name" required />
                </Field>
                <Field label="Email address">
                  <input name="email" type="email" autoComplete="email" value={values.email} onChange={update} placeholder="you@company.com" required />
                </Field>
                <Field label="Mobile number">
                  <input name="phone" type="tel" inputMode="tel" autoComplete="tel" value={values.phone} onChange={update} placeholder="+91 98765 43210" maxLength="16" required />
                </Field>
                <Field label="Brand name">
                  <input name="brand_name" autoComplete="organization" value={values.brand_name} onChange={update} placeholder="Your brand name" required />
                </Field>
                <Field label="Number of orders per month" wide>
                  <input name="monthly_orders" type="number" inputMode="numeric" min="0" step="1" value={values.monthly_orders} onChange={update} placeholder="e.g. 2500" required />
                </Field>
              </div>

              <input type="text" name="_honey" tabIndex="-1" autoComplete="off" className="iqd-honeypot" aria-hidden="true" />
              {status === "error" && <p className="iqd-error" role="alert">{statusMessage}</p>}
              <div className="iqd-form-submit">
                <button type="submit" disabled={status === "submitting"}>
                  {status === "submitting" ? <><LoaderCircle size={16} className="iqd-spinner" /> Sending request…</> : <>Request my walkthrough <ArrowRight size={16} /></>}
                </button>
                <small><LockKeyhole size={12} /> Your details are used only to respond to this IQ enquiry.</small>
              </div>
            </form>
          )}
        </div>
      </section>

      <footer className="iqd-footer">
        <a className="iqd-brand" href={productUrl}><img src={logo} alt="ParcelX" /><span /><b>IQ</b></a>
        <span>Shipping intelligence, built around your business.</span>
        <a href={productUrl}>Explore ParcelX IQ <ArrowRight size={13} /></a>
      </footer>
    </main>
  );
}
