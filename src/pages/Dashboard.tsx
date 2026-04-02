import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Store, Leaf, Tractor, Dog, BookOpen } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const siteCards = [
  { id: "fbms-store", icon: Store, titleKey: "FBMS Store", descKey: "siteStoreDesc" as const },
  { id: "plant-help", icon: Leaf, titleKey: "Plant Help", descKey: "sitePlantHelpDesc" as const },
  { id: "farm-tracker", icon: Tractor, titleKey: "Farm Tracker", descKey: "siteFarmTrackerDesc" as const },
  { id: "fbms-ani", icon: Dog, titleKey: "FBMS Ani", descKey: "siteAniDesc" as const },
  { id: "fbms-blog", icon: BookOpen, titleKey: "FBMS Blog", descKey: "siteBlogDesc" as const },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="container px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-6 sm:space-y-8">
      <header className="animate-in text-center">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-2 text-balance text-primary">Welcome to Farm Based Management System</h1>
        <p className="text-sm sm:text-base lg:text-lg italic text-muted-foreground">Digitally Ensuring Prosperity</p>
      </header>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 animate-in stagger-1">
        {siteCards.map((site) => (
          <Card
            key={site.id}
            onClick={() => navigate(`/site/${site.id}`)}
            className="card-hover border-0 shadow-soft cursor-pointer group transition-all duration-300 hover:scale-[1.03] hover:shadow-lg"
          >
            <CardContent className="flex flex-col items-center justify-center gap-3 sm:gap-4 p-5 sm:p-8 text-center">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <site.icon className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-1">{site.titleKey}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{t.auth[site.descKey]}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
