import React from "react";
import { createRoot } from "react-dom/client";
import "../../src/styles/global.css";
import ParcelXIQDemo from "../../src/pages/ParcelXIQDemo.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ParcelXIQDemo />
  </React.StrictMode>
);
