import { useParams } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const siteMap: Record<string, { title: string; url: string }> = {
  "fbms-store": {
    title: "FBMS Store",
    url: "https://fbmsstore.netlify.app/",
  },
};

export default function SiteViewer() {
  const { siteId } = useParams<{ siteId: string }>();
  const site = siteId ? siteMap[siteId] : null;

  if (!site) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Site not found</h2>
          <p className="text-muted-foreground">The requested site could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <h1 className="text-xl font-semibold">{site.title}</h1>
        <Button variant="outline" size="sm" asChild>
          <a href={site.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            Open in new tab
          </a>
        </Button>
      </div>
      <div className="flex-1 relative">
        <iframe
          src={site.url}
          className="absolute inset-0 w-full h-full border-0"
          title={site.title}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </div>
  );
}
