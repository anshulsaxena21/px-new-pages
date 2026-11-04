import React from "react";
import { createRoot } from "react-dom/client";
import KnowledgeBase from "./pages/KnowledgeBase.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <KnowledgeBase />
  </React.StrictMode>
);
