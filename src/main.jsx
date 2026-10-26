import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// The preserved Header/Footer markup uses Bootstrap utility classes and collapse behavior.
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";

// Landing-page styles load after Bootstrap; the legacy stylesheet styles only the shared chrome.
import "./styles/global.css";
import "./styles/legacy-header-footer.css";
import Fulfillment from "./pages/Fulfillment.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Fulfillment />
    </BrowserRouter>
  </React.StrictMode>
);
