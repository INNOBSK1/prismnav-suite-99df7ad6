import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Keep the brand in the tab title even when Google Translate rewrites the page.
const titleEl = document.querySelector("title");
if (titleEl) {
  titleEl.setAttribute("translate", "no");
  new MutationObserver(() => {
    if (!document.title.includes("NIMALUNDA")) document.title = "NIMALUNDA";
  }).observe(titleEl, { childList: true, characterData: true, subtree: true });
}

createRoot(document.getElementById("root")!).render(<App />);
