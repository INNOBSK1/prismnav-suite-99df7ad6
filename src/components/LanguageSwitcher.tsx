import { Globe } from 'lucide-react';
import { useLanguage, LANGUAGE_ORDER } from '@/i18n/LanguageContext';
import { languageNames, Language } from '@/i18n/translations';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Globe className="h-4 w-4" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="notranslate max-h-80 overflow-y-auto" translate="no">
        {LANGUAGE_ORDER.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => setLanguage(lang)}
            className={language === lang ? 'bg-accent' : ''}
          >
            <span className="mr-2">{lang === 'en' ? '🇬🇧' : lang === 'sw' ? '🇰🇪' : '🇺🇬'}</span>{languageNames[lang]}{language === lang && <span className="ml-auto pl-3 text-primary">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
