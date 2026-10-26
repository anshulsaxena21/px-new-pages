import React, { useState } from "react";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (!email.trim()) return;
    setMessage("This form is not connected to a subscription service yet.");
  }

  return (
    <form className="d-flex" onSubmit={handleSubmit}>
      <input
        className="form-control me-3"
        type="email"
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
          setMessage("");
        }}
        placeholder="Enter Email id"
        aria-label="Email address"
        required
      />
      <button className="btn btn-primary footer-btn" type="submit">
        Subscribe
      </button>
      {message && <p className="subscribe-form-message" role="status">{message}</p>}
    </form>
  );
}
