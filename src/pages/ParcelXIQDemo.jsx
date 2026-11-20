import React, { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BadgeCheck, BarChart3, CheckCircle2, Headset, Layers3, LoaderCircle, LockKeyhole, PackageCheck, Sparkles, Ticket, Truck, Wallet } from "lucide-react";
import logo from "../images/ParcelX_Logo.svg";
import "../styles/parcelx-iq-demo.css";

const inboxEndpoint = "https://formsubmit.co/ajax/hello@parcelx.in";
const productUrl = "https://anshulsaxena21.github.io/px-new-pages/parcelx-iq-product.html";
const intentCopy = {
  demo: { eyebrow: "PRODUCT WALKTHROUGH", title: "See what ParcelX IQ can do for your business.", description: "Tell us a little about your setup. The IQ team can take you through the product and help you explore the right way to use it." },
  standalone: { eyebrow: "STANDALONE IQ WORKSPACE", title: "Let's explore your own IQ workspace.", description: "Share your business details and the workflows you want to bring into one dedicated shipping intelligence workspace." },
  embedded: { eyebrow: "EMBEDDED IQ EXPERIENCE", title: "Bring IQ into your own seller experience.", description: "Tell us about your website or seller portal and the IQ modules you'd like to explore embedding." },
  integration: { eyebrow: "INTEGRATION ENQUIRY", title: "Let's talk about your integration needs.", description: "Share your current setup and the way you'd like ParcelX IQ to fit into your existing tools." },
  question: { eyebrow: "TALK TO THE IQ TEAM", title: "What would you like to know about IQ?", description: "Send your question to the ParcelX IQ team and give us a little context so we can guide you better." }
};
const useOptions = [
  ["standalone", "Standalone IQ workspace"],
  ["embedded", "Embedded into my website / portal"],
  ["both", "Both standalone and embedded"],
  ["unsure", "Not sure yet — help me decide"]
];
const volumeOptions = [
  "Below 1,000 shipments / month",
  "1,000 – 5,000 shipments / month",
  "5,001 – 20,000 shipments / month",
  "20,001 – 100,000 shipments / month",
  "Above 100,000 shipments / month",
  "Prefer to discuss"
];

function Field({ label, required, children, wide = false, hint }) {
  return <label className={"iqd-field" + (wide ? " iqd-field-wide" : "")}>
    <span className="iqd-label">{label}{required && <i>*</i>}</span>
    {children}
    {hint && <small>{hint}</small>}
  </label>;
}

export default function ParcelXIQDemo() {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const initialIntent = params.get("intent") || "demo";
  const initialUse = ["standalone", "embedded", "both"].includes(initialIntent) ? initialIntent : "";
  const [values, setValues] = useState({
    name: "", email: "", phone: "", company: "", website: "", business_type: "",
    deployment_preference: initialUse, monthly_shipments: "", message: ""
  });
  const [status, setStatus] = useState("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const copy = intentCopy[initialIntent] || intentCopy.demo;

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
    setValues({ name: "", email: "", phone: "", company: "", website: "", business_type: "", deployment_preference: initialUse, monthly_shipments: "", message: "" });
    setStatus("idle");
    setStatusMessage("");
  }

  return <main className="iqd-page">
    <header className="iqd-header">
      <a className="iqd-brand" href={productUrl} aria-label="Back to ParcelX IQ">
        <img src={logo} alt="ParcelX"/><span/><b>IQ</b>
      </a>
      <a className="iqd-back" href={productUrl}><ArrowLeft size={15}/> Back to ParcelX IQ</a>
    </header>

    <section className="iqd-main">
      <div className="iqd-intro">
        <div className="iqd-kicker"><span><Sparkles size={13}/></span> {copy.eyebrow}</div>
        <h1>{copy.title}</h1>
        <p>{copy.description}</p>
        <div className="iqd-benefits">
          <div><span className="benefit-violet"><BarChart3 size={17}/></span><b>Shipping insights</b><small>Zone, courier & user views</small></div>
          <div><span className="benefit-blue"><Truck size={17}/></span><b>Operational visibility</b><small>Shipments, tickets & NDR</small></div>
          <div><span className="benefit-teal"><Layers3 size={17}/></span><b>Flexible adoption</b><small>Standalone or embedded</small></div>
        </div>
        <div className="iqd-product-note">
          <div className="iqd-note-icon"><LockKeyhole size={17}/></div>
          <div><b>Built around your workflow</b><p>Tell us how you work today. We'll use this information to shape a relevant product conversation—not send you a generic sales pitch.</p></div>
        </div>
        <div className="iqd-capability-strip">
          <span><BarChart3 size={13}/> Analytics</span><span><Ticket size={13}/> Tickets</span><span><Wallet size={13}/> Wallet</span><span><PackageCheck size={13}/> Tracking</span><span><Headset size={13}/> Support</span>
        </div>
      </div>

      <div className="iqd-form-card">
        <div className="iqd-form-head">
          <div><span>LET'S GET STARTED</span><h2>Request your IQ walkthrough</h2><p>Fill in the details below. Fields marked <i>*</i> are required.</p></div>
          <span className="iqd-form-spark"><Sparkles size={20}/></span>
        </div>

        {status === "success" ? <div className="iqd-success" role="status">
          <span><CheckCircle2 size={30}/></span><h3>Request received.</h3><p>{statusMessage}</p>
          <div className="iqd-success-next"><BadgeCheck size={16}/> Your enquiry is marked for the ParcelX IQ team.</div>
          <button type="button" onClick={resetForm}>Submit another enquiry <ArrowRight size={15}/></button>
          <a href={productUrl}>Return to ParcelX IQ <ArrowLeft size={14}/></a>
        </div> : <form className="iqd-form" onSubmit={handleSubmit}>
          <div className="iqd-form-grid">
            <Field label="Your name" required><input name="name" autoComplete="name" value={values.name} onChange={update} placeholder="e.g. Ananya Sharma" required/></Field>
            <Field label="Work email" required><input name="email" type="email" autoComplete="email" value={values.email} onChange={update} placeholder="you@company.com" required/></Field>
            <Field label="Company / brand name" required><input name="company" autoComplete="organization" value={values.company} onChange={update} placeholder="Your business name" required/></Field>
            <Field label="Phone number"><input name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={update} placeholder="+91 98765 43210"/></Field>
            <Field label="Business website" hint="Optional — share your store or company website."><input name="website" type="url" value={values.website} onChange={update} placeholder="https://yourstore.com"/></Field>
            <Field label="What best describes your business?" required>
              <select name="business_type" value={values.business_type} onChange={update} required>
                <option value="" disabled>Select business type</option><option>D2C / Ecommerce brand</option><option>Marketplace seller</option><option>Retail / Omnichannel</option><option>Enterprise</option><option>3PL / Logistics</option><option>Other</option>
              </select>
            </Field>
            <Field label="How would you like to use IQ?" required wide>
              <div className="iqd-choice-grid">{useOptions.map(([value, label]) => <label className={values.deployment_preference === value ? "iqd-choice selected" : "iqd-choice"} key={value}>
                <input type="radio" name="deployment_preference" value={value} checked={values.deployment_preference === value} onChange={update} required/>
                <span className="iqd-choice-check"/><span>{label}</span>
              </label>)}</div>
            </Field>
            <Field label="Approx. monthly shipment volume" wide>
              <select name="monthly_shipments" value={values.monthly_shipments} onChange={update}>
                <option value="">Choose a shipment range</option>{volumeOptions.map(option => <option key={option}>{option}</option>)}
              </select>
            </Field>
            <Field label="What would you like to explore?" wide hint="Share a little context so we can make the walkthrough useful for your team.">
              <textarea name="message" value={values.message} onChange={update} placeholder="Tell us about your current shipping setup, challenges or the IQ capabilities you're interested in..." rows="4"/>
            </Field>
          </div>
          <input type="text" name="_honey" tabIndex="-1" autoComplete="off" className="iqd-honeypot" aria-hidden="true"/>
          {status === "error" && <p className="iqd-error" role="alert">{statusMessage}</p>}
          <div className="iqd-form-submit">
            <button type="submit" disabled={status === "submitting"}>{status === "submitting" ? <><LoaderCircle size={16} className="iqd-spinner"/> Sending request…</> : <>Request my walkthrough <ArrowRight size={16}/></>}</button>
            <small><LockKeyhole size={12}/> Your details are used only to respond to this IQ enquiry.</small>
          </div>
        </form>}
      </div>
    </section>

    <footer className="iqd-footer">
      <a className="iqd-brand" href={productUrl}><img src={logo} alt="ParcelX"/><span/><b>IQ</b></a>
      <span>Shipping intelligence, built around your business.</span>
      <a href={productUrl}>Explore ParcelX IQ <ArrowRight size={13}/></a>
    </footer>
  </main>;
}
