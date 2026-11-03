import { useEffect } from "react";

/**
 * Initializes accessibility classes on <html> based on saved preferences.
 * - html.a11y-high-contrast
 * - html.a11y-large-text
 * - html.a11y-reduced-motion
 */
export function A11yInit() {
  useEffect(() => {
    try {
      const root = document.documentElement;

      const checkAndApply = (key, cls) => {
        if (localStorage.getItem(key) === "true") {
          root.classList.add(cls);
        }
      };

      checkAndApply("a11y-high-contrast", "a11y-high-contrast");
      checkAndApply("a11y-large-text", "a11y-large-text");
      checkAndApply("a11y-reduced-motion", "a11y-reduced-motion");

      const saved = localStorage.getItem("a11y_preferences") || localStorage.getItem("a11y");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.highContrast || parsed["high-contrast"]) root.classList.add("a11y-high-contrast");
          if (parsed.largeText || parsed["large-text"]) root.classList.add("a11y-large-text");
          if (parsed.reducedMotion || parsed["reduced-motion"]) root.classList.add("a11y-reduced-motion");
        } catch {}
      }
    } catch {
      // In restricted environments, localStorage might throw
    }
  }, []);

  return null;
}

export default A11yInit;

