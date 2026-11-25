import React from "react";
import { createRoot } from "react-dom/client";
import FigmaImporter from "./FigmaImporter.jsx";
import "./FigmaImporter.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode><FigmaImporter /></React.StrictMode>
);