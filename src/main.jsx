import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { getCachedLocation } from "./lib/location";

// Automatically prefix root-relative image/icon paths for GitHub Pages subpath hosting
if (typeof window !== "undefined") {
  const prefix = (url) => {
    if (typeof url === "string" && (url.startsWith("/images/") || url.startsWith("/icons/"))) {
      const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
      if (base && !url.startsWith(base)) {
        return base + url;
      }
    }
    return url;
  };

  const origSet = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function (k, v) {
    if (k === "src" && typeof v === "string") v = prefix(v);
    return origSet.call(this, k, v);
  };

  const desc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, "src");
  if (desc && desc.set) {
    const origSrc = desc.set;
    Object.defineProperty(HTMLImageElement.prototype, "src", {
      set(v) {
        return origSrc.call(this, prefix(v));
      },
      get: desc.get,
      configurable: true,
      enumerable: true,
    });
  }
}

// Immediately sanitize cached location on startup across all mobile browsers
getCachedLocation();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);

