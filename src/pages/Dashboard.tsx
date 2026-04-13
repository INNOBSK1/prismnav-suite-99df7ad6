import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Store, Leaf, Tractor, Dog, BookOpen } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const siteCards = [
  { id: "plant-help", icon: Leaf, titleKey: "Plant Help", descKey: "sitePlantHelpDesc" as const },
  { id: "fbms-ani", icon: Dog, titleKey: "FBMS Ani", descKey: "siteAniDesc" as const },
  { id: "farm-tracker", icon: Tractor, titleKey: "Farm Tracker", descKey: "siteFarmTrackerDesc" as const },
  { id: "fbms-store", icon: Store, titleKey: "FBMS Store", descKey: "siteStoreDesc" as const },
  { id: "fbms-blog", icon: BookOpen, titleKey: "FBMS Blog", descKey: "siteBlogDesc" as const },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="container py-10 space-y-8">
      <header className="animate-in text-center">
        <h1 className="text-4xl font-semibold mb-2 text-balance text-primary">Welcome to Farm Based Management System</h1>
        <p className="text-lg italic text-muted-foreground">Digitally Ensuring Prosperity</p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-in stagger-1">
        {siteCards.map((site) => (
          <Card
            key={site.id}
            onClick={() => navigate(`/site/${site.id}`)}
            className="card-hover border-0 shadow-soft cursor-pointer group transition-all duration-300 hover:scale-[1.03] hover:shadow-lg"
          >
            <CardContent className="flex flex-col items-center justify-center gap-4 p-8 text-center">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <site.icon className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">{site.titleKey}</h3>
                <p className="text-sm text-muted-foreground">{t.auth[site.descKey]}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
