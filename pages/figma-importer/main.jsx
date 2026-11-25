import React from "react";
import { createRoot } from "react-dom/client";
import FigmaImporter from "../../src/pages/FigmaImporter.jsx";
import "../../src/pages/FigmaImporter.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode><FigmaImporter /></React.StrictMode>
);