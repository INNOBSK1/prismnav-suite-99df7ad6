import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: {
          new (
            options: {
              pageLanguage: string;
              includedLanguages: string;
              layout: unknown;
              autoDisplay: boolean;
              multilanguagePage?: boolean;
            },
            elementId: string
          ): void;
          InlineLayout: { HORIZONTAL: unknown; SIMPLE: unknown };
        };
      };
    };
  }
}

// Local/regional languages supported by Google Translate
const LOCAL_LANGUAGES = [
  'en',  // English
  'lg',  // Luganda
  'sw',  // Kiswahili
  'ach', // Acholi (Luo)
  'ny',  // Chichewa (Bantu family)
  'rw',  // Kinyarwanda (close to Rukiga/Runyankole)
  'rn',  // Kirundi
].join(',');

export function GoogleTranslate() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    window.googleTranslateElementInit = () => {
      if (window.google?.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: LOCAL_LANGUAGES,
            layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL,
            autoDisplay: false,
            multilanguagePage: true,
          },
          'google_translate_element'
        );
      }
    };

    // Load Google Translate script
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src =
        '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div
      id="google_translate_element"
      className="google-translate-container"
    />
  );
}
