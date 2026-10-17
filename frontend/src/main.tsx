import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MotionConfig } from "motion/react";
import App from "./App.tsx";
import { LanguageProvider } from "./i18n";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LanguageProvider>
      {/* Con "reducedMotion: user" motion omite las animaciones de transform
          cuando el sistema pide movimiento reducido (sigue con opacidad). */}
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </LanguageProvider>
  </StrictMode>,
);
