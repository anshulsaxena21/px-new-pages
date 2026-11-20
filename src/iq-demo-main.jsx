import React from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import ParcelXIQDemo from "./pages/ParcelXIQDemo.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ParcelXIQDemo />
  </React.StrictMode>
);
