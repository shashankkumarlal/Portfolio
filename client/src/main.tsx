import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { LENIS_ENABLED } from "@/config/ui";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

// Mount app
createRoot(document.getElementById("root")!).render(<App />);

// Lenis smooth scrolling (gated)
try {
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (LENIS_ENABLED && !reduce) {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      smoothTouch: false,
      syncTouch: true,
      gestureOrientation: "vertical",
    });
    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }
} catch {}
