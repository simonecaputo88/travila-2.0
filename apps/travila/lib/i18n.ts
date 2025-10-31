// apps/travila/lib/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

const resources = {
  it: {
    translation: {
      home_title: 'Benvenuto su Travila 2.0',
      home_sub: 'Il tuo travel planner AI per Web, iOS e Android.',
      fast: {
        title: 'Itinerario Fast',
        city_label: 'Città',
        days_label: 'Giorni',
        lang_label: 'Lingua',
        generate_btn: 'Genera Itinerario',
        example_city: 'Roma'
      }
    }
  },
  en: {
    translation: {
      home_title: 'Welcome to Travila 2.0',
      home_sub: 'Your AI travel planner for Web, iOS and Android.',
      fast: {
        title: 'Fast Itinerary',
        city_label: 'City',
        days_label: 'Days',
        lang_label: 'Language',
        generate_btn: 'Generate Itinerary',
        example_city: 'Rome'
      }
    }
  }
};

const deviceLocales = Localization.getLocales?.() ?? [];
const deviceLang = deviceLocales[0]?.languageCode === 'it' ? 'it' : 'en';

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: deviceLang,
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
      compatibilityJSON: 'v3',
    })
    .catch(() => { /* noop */ });
}

export default i18n;
