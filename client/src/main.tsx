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
      touchMultiplier: 1.5,
      syncTouch: true,
      gestureOrientation: "vertical" as const,
      // @ts-ignore - smoothTouch is not in the type definitions but is a valid option
      smoothTouch: true,
    });
    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }
} catch {}
