import { useEffect, useRef, useState } from 'react';
import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

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

const LOCAL_LANGUAGES = [
  'en', 'lg', 'sw', 'ach', 'ny', 'rw', 'rn',
].join(',');

export function GoogleTranslate() {
  const initialized = useRef(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    window.googleTranslateElementInit = () => {
      if (window.google?.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: LOCAL_LANGUAGES,
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
            multilanguagePage: true,
          },
          'google_translate_element'
        );
      }
    };

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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Languages className="h-4 w-4" />
          <span className="sr-only">Translate</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto p-2">
        <div id="google_translate_element" className="google-translate-container" />
      </PopoverContent>
    </Popover>
  );
}
