import React from "react";
import { createRoot } from "react-dom/client";
import FigmaImporter from "./pages/FigmaImporter.jsx";
import "./pages/FigmaImporter.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode><FigmaImporter /></React.StrictMode>
);