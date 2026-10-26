import React, { useState } from "react";
import logo from "../images/ParcelX_Logo.svg";
import "./Footer.css";

const socials = [
  ["X", "https://x.com/Parcelx_in"],
  ["Facebook", "https://www.facebook.com/p/Parcel-X-100065408592406/"],
  ["Instagram", "https://www.instagram.com/parcelx.in"],
  ["LinkedIn", "https://in.linkedin.com/company/parcel-x"],
  ["YouTube", "https://www.youtube.com/@ParcelX"],
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  function handleSubmit(event) {
    event.preventDefault();
    if (email.trim()) setSubmitted(true);
  }
  return <footer className="px-footer">
    <div className="px-footer-bg"><div className="px-footer-inner">
      <div className="px-footer-grid">
        <section className="px-footer-about">
          <a className="px-footer-brand" href="#top" aria-label="ParcelX home"><img src={logo} alt="ParcelX" /></a>
          <p>ParcelX offers an AI-powered, smoother, easier and more reliable platform to manage your end-to-end shipping needs.</p>
          <h3>Subscribe to our newsletter</h3>
          {submitted ? <p className="px-subscribe-success" role="status">Thanks for your interest!</p> :
            <form className="px-subscribe-form" onSubmit={handleSubmit}>
              <label className="px-sr-only" htmlFor="px-footer-email">Email address</label>
              <input id="px-footer-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email address" required />
              <button type="submit">Subscribe</button>
            </form>}
          <small className="px-subscribe-note">By subscribing, you agree to receive updates from ParcelX.</small>
        </section>
        <section className="px-footer-right">
          <div className="px-footer-socials" aria-label="Social media links">{socials.map(([label, href]) => <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} title={label}>{label}</a>)}</div>
          <div className="px-footer-links">
            <div><h3>Quick Links</h3><a href="#benefits">Features</a><a href="#contact">Pricing</a><a href="#about">About</a><a href="#contact">Contact</a></div>
            <div><h3>Useful Links</h3><a href="https://parcelx.in/" target="_blank" rel="noreferrer">Privacy Policy</a><a href="https://parcelx.in/" target="_blank" rel="noreferrer">Terms &amp; Conditions</a><a href="https://parcelx.in/" target="_blank" rel="noreferrer">Refund &amp; Cancellation</a><a href="https://parcelx.in/" target="_blank" rel="noreferrer">Data protection</a><a href="https://parcelx.in/" target="_blank" rel="noreferrer">Compliance</a></div>
          </div>
        </section>
      </div>
      <div className="px-footer-bottom"><span><strong>ParcelX</strong> © {new Date().getFullYear()}, All rights reserved.</span><a href="#top">Back to top ↑</a></div>
    </div></div>
  </footer>;
}
