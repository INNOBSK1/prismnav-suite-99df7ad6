import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/i18n/LanguageContext";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface DownloadRecord { id: string; site_name: string; file_name: string; file_url: string; download_date: string; }

export function DownloadsSection() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [downloads, setDownloads] = useState<DownloadRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user) loadDownloads(); }, [user]);

  const loadDownloads = async () => {
    try {
      const { data, error } = await supabase.from('downloads').select('*').eq('user_id', user?.id).order('download_date', { ascending: false });
      if (error) throw error;
      setDownloads(data || []);
    } catch (error) { console.error('Error loading downloads:', error); toast.error(t.downloadsSection.loadError); }
    finally { setLoading(false); }
  };

  const exportToCSV = () => {
    if (downloads.length === 0) { toast.error(t.downloadsSection.noExportData); return; }
    const headers = [t.downloadsSection.date, 'Site', t.downloadsSection.fileName, 'URL'];
    const csvData = downloads.map(d => [new Date(d.download_date).toLocaleString(), d.site_name, d.file_name, d.file_url]);
    const csv = [headers.join(','), ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `downloads-${new Date().toISOString().split('T')[0]}.csv`; a.click();
    window.URL.revokeObjectURL(url);
    toast.success(t.downloadsSection.exportSuccess);
  };

  if (loading) {
    return (
      <Card><CardHeader><CardTitle className="flex items-center gap-2"><Download className="h-5 w-5" />{t.downloadsSection.title}</CardTitle></CardHeader>
        <CardContent><p className="text-muted-foreground">{t.profile.loading}</p></CardContent></Card>
    );
  }

  const downloadsBySite = downloads.reduce((acc, download) => {
    if (!acc[download.site_name]) acc[download.site_name] = [];
    acc[download.site_name].push(download);
    return acc;
  }, {} as Record<string, DownloadRecord[]>);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2"><Download className="h-5 w-5" />{t.downloadsSection.title}</CardTitle>
            <CardDescription>{t.downloadsSection.description}</CardDescription>
          </div>
          {downloads.length > 0 && (
            <Button onClick={exportToCSV} variant="outline" size="sm"><FileDown className="h-4 w-4 mr-2" />{t.downloadsSection.exportCSV}</Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {downloads.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">{t.downloadsSection.noDownloads}</p>
        ) : (
          <div className="space-y-6">
            {Object.entries(downloadsBySite).map(([siteName, siteDownloads]) => (
              <div key={siteName}>
                <h3 className="font-semibold text-lg mb-3">{siteName}</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader><TableRow>
                      <TableHead>{t.downloadsSection.date}</TableHead>
                      <TableHead>{t.downloadsSection.fileName}</TableHead>
                      <TableHead>{t.downloadsSection.action}</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {siteDownloads.map((download) => (
                        <TableRow key={download.id}>
                          <TableCell>{new Date(download.download_date).toLocaleDateString()}</TableCell>
                          <TableCell className="font-medium">{download.file_name}</TableCell>
                          <TableCell><Button variant="ghost" size="sm" onClick={() => window.open(download.file_url, '_blank')}><Download className="h-4 w-4" /></Button></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
