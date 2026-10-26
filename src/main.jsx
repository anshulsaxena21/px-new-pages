import React from "react";
import { createRoot } from "react-dom/client";
import Fulfillment from "./pages/Fulfillment.jsx";
import "./styles/global.css";
createRoot(document.getElementById("root")).render(<React.StrictMode><Fulfillment /></React.StrictMode>);