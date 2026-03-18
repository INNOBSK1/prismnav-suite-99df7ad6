import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Download } from "lucide-react";
import { ProfileSection } from "@/components/ProfileSection";
import { DownloadsSection } from "@/components/DownloadsSection";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/i18n/LanguageContext";

interface SiteDownloadStats {
  site_name: string;
  count: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [downloadStats, setDownloadStats] = useState<SiteDownloadStats[]>([]);
  const [totalDownloads, setTotalDownloads] = useState(0);

  useEffect(() => {
    if (user) loadDownloadStats();
  }, [user]);

  const loadDownloadStats = async () => {
    try {
      const { data, error } = await supabase.from('downloads').select('site_name').eq('user_id', user?.id);
      if (error) throw error;
      const stats = (data || []).reduce((acc, download) => {
        const existing = acc.find(s => s.site_name === download.site_name);
        if (existing) existing.count++;
        else acc.push({ site_name: download.site_name, count: 1 });
        return acc;
      }, [] as SiteDownloadStats[]);
      setDownloadStats(stats);
      setTotalDownloads(data?.length || 0);
    } catch (error) {
      console.error('Error loading download stats:', error);
    }
  };

  return (
    <div className="container py-10 space-y-8">
      <header className="animate-in">
        <h1 className="text-4xl font-semibold mb-3 text-balance">{t.dashboard.welcomeBack}</h1>
        <p className="text-muted-foreground text-lg">{t.dashboard.accountOverview}</p>
      </header>
      
      <div className="grid gap-5 md:grid-cols-2 animate-in stagger-1">
        <Card className="card-hover border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-medium">{t.dashboard.availableSites}</CardTitle>
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Store className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-semibold">5</div>
            <p className="text-sm text-muted-foreground mt-1">{t.dashboard.sitesAccess}</p>
          </CardContent>
        </Card>

        <Card className="card-hover border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-medium">{t.dashboard.downloads}</CardTitle>
            <div className="h-9 w-9 rounded-lg bg-accent/20 flex items-center justify-center">
              <Download className="h-4 w-4 text-accent-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-semibold">{totalDownloads}</div>
            <p className="text-sm text-muted-foreground mt-1">{t.dashboard.totalDownloads}</p>
            {downloadStats.length > 0 && (
              <div className="mt-5 pt-4 border-t border-border/50 space-y-2">
                {downloadStats.map((stat) => (
                  <div key={stat.site_name} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{stat.site_name}</span>
                    <span className="font-medium tabular-nums">{stat.count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="animate-in stagger-2"><DownloadsSection /></div>
      <div className="animate-in stagger-3"><ProfileSection /></div>
    </div>
  );
}
