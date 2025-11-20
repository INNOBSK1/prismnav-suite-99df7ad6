import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Download } from "lucide-react";
import { TrialBanner } from "@/components/TrialBanner";
import { ProfileSection } from "@/components/ProfileSection";
import { DownloadsSection } from "@/components/DownloadsSection";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface SiteDownloadStats {
  site_name: string;
  count: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [downloadStats, setDownloadStats] = useState<SiteDownloadStats[]>([]);
  const [totalDownloads, setTotalDownloads] = useState(0);

  useEffect(() => {
    if (user) {
      loadDownloadStats();
    }
  }, [user]);

  const loadDownloadStats = async () => {
    try {
      const { data, error } = await supabase
        .from('downloads')
        .select('site_name')
        .eq('user_id', user?.id);

      if (error) throw error;

      // Group by site and count
      const stats = (data || []).reduce((acc, download) => {
        const existing = acc.find(s => s.site_name === download.site_name);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ site_name: download.site_name, count: 1 });
        }
        return acc;
      }, [] as SiteDownloadStats[]);

      setDownloadStats(stats);
      setTotalDownloads(data?.length || 0);
    } catch (error) {
      console.error('Error loading download stats:', error);
    }
  };

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Manage your account and track your activity</p>
      </div>
      
      <TrialBanner />
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sites</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Total sites available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDownloads}</div>
            <p className="text-xs text-muted-foreground">Files downloaded</p>
            {downloadStats.length > 0 && (
              <div className="mt-4 space-y-1">
                {downloadStats.map((stat) => (
                  <div key={stat.site_name} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{stat.site_name}</span>
                    <span className="font-medium">{stat.count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <DownloadsSection />

      <ProfileSection />
    </div>
  );
}
