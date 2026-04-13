import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    gtranslateSettings?: Record<string, unknown>;
  }
}

export function GoogleTranslate() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // GTranslate settings – local/regional languages only
    window.gtranslateSettings = {
      default_language: 'en',
      languages: ['en', 'lg', 'sw', 'ach', 'ny', 'rw', 'rn'],
      wrapper_selector: '.gtranslate_wrapper',
      switcher_horizontal_position: 'right',
      switcher_vertical_position: 'top',
      float_switcher_open_direction: 'bottom',
      flag_style: 'circle',
      alt_flags: { en: 'usa' },
    };

    if (!document.getElementById('gtranslate-script')) {
      const script = document.createElement('script');
      script.id = 'gtranslate-script';
      script.src = 'https://cdn.gtranslate.net/widgets/latest/float.js';
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  return <div className="gtranslate_wrapper" />;
}
