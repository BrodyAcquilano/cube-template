import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import Viewport from "./Viewport";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Viewport />
  </StrictMode>,
);
