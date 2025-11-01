import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import hi from "./locales/hi.json";
import mr from "./locales/mr.json";

// Initialize i18next once for the app
if (!i18next.isInitialized) {
  i18next
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        hi: { translation: hi },
        mr: { translation: mr },
      },
      lng: "en",
      fallbackLng: "en",
      interpolation: { escapeValue: false },
    })
    .catch(() => {
      // Intentionally ignore initialization errors; app can still render
    });
}

export default i18next;


