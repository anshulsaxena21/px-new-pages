import React from "react";
import { createRoot } from "react-dom/client";

// Shared site components rely on Bootstrap navigation, accordion and footer styling.
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./styles/global.css";
import "./styles/legacy-header-footer.css";

import ParcelXIQ from "./pages/ParcelXIQ.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ParcelXIQ />
  </React.StrictMode>
);
