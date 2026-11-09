import { createRoot } from "react-dom/client";
import "@fontsource/commit-mono/400.css";
import "./styles/global.css";
import { App } from "./App";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<App />);
}
