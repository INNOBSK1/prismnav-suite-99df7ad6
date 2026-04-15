import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/i18n/LanguageContext";

const siteMap: Record<string, { title: string; url: string }> = {
  "plant-help": { title: "Plant Help", url: "https://planthelp.netlify.app/" },
  "fbms-ani": { title: "FBMS Ani", url: "https://fbmsani.netlify.app/" },
  "farm-tracker": { title: "Farm Tracker", url: "https://fbmsfarmtracker.netlify.app/" },
  "fbms-store": { title: "FBMS Store", url: "https://fbmsstore.netlify.app/" },
  "fbms-blog": { title: "FBMS Blog", url: "https://fbmsblog.netlify.app/" },
};

// Map our app languages to Google Translate language codes
const langToGoogleCode: Record<string, string> = {
  en: 'en',
  lg: 'lg',
  sw: 'sw',
  ach: 'ach',
  ny: 'ny',
  rw: 'rw',
  rn: 'rn',
  nyn: 'rw',   // Runyankole → closest
  lug: 'lg',   // Lusoga → closest
  teo: 'en',   // Ateso fallback
  lgg: 'en',   // Lugbara fallback
  laj: 'en',   // Langi fallback
  cgg: 'rw',   // Rukiga → closest
};

function getTranslatedUrl(siteUrl: string, targetLang: string): string {
  if (targetLang === 'en') return siteUrl;
  const googleLang = langToGoogleCode[targetLang] || 'en';
  if (googleLang === 'en') return siteUrl;
  // Use Google Translate's proxy to translate the entire page
  return `https://translate.google.com/translate?sl=en&tl=${googleLang}&u=${encodeURIComponent(siteUrl)}`;
}

export default function SiteViewer() {
  const { siteId } = useParams<{ siteId: string }>();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const site = siteId ? siteMap[siteId] : null;

  // Detect active Google Translate language from cookie
  const [gtLang, setGtLang] = useState('en');

  useEffect(() => {
    const checkLang = () => {
      const match = document.cookie.match(/googtrans=\/en\/(\w+)/);
      setGtLang(match ? match[1] : 'en');
    };
    checkLang();
    const interval = setInterval(checkLang, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      const trustedOrigins = [
        ...Object.values(siteMap).map(s => new URL(s.url).origin),
        'https://translate.google.com',
        'https://translate.googleusercontent.com',
      ];
      if (!trustedOrigins.includes(event.origin)) return;
      if (event.data.type === 'download' && user && siteId) {
        try {
          await supabase.from('downloads').insert({
            user_id: user.id, site_id: siteId, site_name: site?.title || 'Unknown',
            file_name: event.data.fileName, file_url: event.data.fileUrl,
          });
        } catch (error) { console.error('Error tracking download:', error); }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [user, siteId, site]);

  if (!site) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">{t.siteViewer.notFound}</h2>
          <p className="text-muted-foreground">{t.siteViewer.notFoundDesc}</p>
        </div>
      </div>
    );
  }

  // Use the Google Translate language detected from cookie, or fall back to app language
  const activeLang = gtLang !== 'en' ? gtLang : language;
  const iframeSrc = getTranslatedUrl(site.url, activeLang);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 relative">
        <iframe
          key={`${activeLang}-${siteId}`}
          src={iframeSrc}
          className="absolute inset-0 w-full h-full border-0"
          title={site.title}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads allow-popups-to-escape-sandbox"
          allow="camera; microphone; geolocation"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
}
