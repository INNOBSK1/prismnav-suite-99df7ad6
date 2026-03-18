import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { AIChatSidebar } from "@/components/AIChatSidebar";
import { OfflineIndicator } from "@/components/OfflineIndicator";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  return (
    <SidebarProvider defaultOpen={false}>
      <OfflineIndicator />
      <div className="flex min-h-screen w-full">
        <AppSidebar onAIChatToggle={() => setIsAIChatOpen(!isAIChatOpen)} />
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border/50 bg-background/80 backdrop-blur-sm px-6">
            <SidebarTrigger />
            <div className="flex-1" />
            <LanguageSwitcher />
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
        {isAIChatOpen && <AIChatSidebar onClose={() => setIsAIChatOpen(false)} />}
      </div>
    </SidebarProvider>
  );
}
