import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/i18n/LanguageContext";

const siteMap: Record<string, { title: string; url: string }> = {
  "fbms-store": { title: "FBMS Store", url: "https://fbmsstore.netlify.app/" },
  "plant-help": { title: "Plant Help", url: "https://planthelp.netlify.app/" },
  "farm-tracker": { title: "Farm Tracker", url: "https://fbmsfarmtracker.netlify.app/" },
  "fbms-ani": { title: "FBMS Ani", url: "https://fbmsani.netlify.app/" },
  "fbms-blog": { title: "FBMS Blog", url: "https://fbmsblog.netlify.app/" },
};

export default function SiteViewer() {
  const { siteId } = useParams<{ siteId: string }>();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const site = siteId ? siteMap[siteId] : null;

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      const trustedOrigins = Object.values(siteMap).map(s => new URL(s.url).origin);
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

  const siteUrlWithLang = (() => {
    const url = new URL(site.url);
    url.searchParams.set('lang', language);
    return url.toString();
  })();

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 relative">
        <iframe src={siteUrlWithLang} className="absolute inset-0 w-full h-full border-0" title={site.title}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads allow-popups-to-escape-sandbox" />
      </div>
    </div>
  );
}
