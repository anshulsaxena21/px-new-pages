import React from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import ParcelXIQ from "./pages/ParcelXIQ.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ParcelXIQ />
  </React.StrictMode>
);
