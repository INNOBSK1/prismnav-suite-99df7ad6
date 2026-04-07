import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages: string;
            layout: number;
            autoDisplay: boolean;
          },
          elementId: string
        ) => void;
      };
    };
  }
}

// Google Translate language codes for our local languages
// Not all may be supported by Google Translate, but we include the ones that are
const LOCAL_LANGUAGES = [
  'en',  // English
  'lg',  // Luganda
  'sw',  // Kiswahili
  'ach', // Acholi
  'ny',  // Chichewa (closest to some Bantu languages)
  'rw',  // Kinyarwanda (close to Rukiga/Runyankole)
  'rn',  // Kirundi (close to regional languages)
].join(',');

export function GoogleTranslate() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Define the callback
    window.googleTranslateElementInit = () => {
      if (window.google?.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: LOCAL_LANGUAGES,
            layout: 1, // HORIZONTAL layout
            autoDisplay: false,
          },
          'google_translate_element'
        );
      }
    };

    // Load the script if not already loaded
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
      className="google-translate-wrapper"
    />
  );
}
