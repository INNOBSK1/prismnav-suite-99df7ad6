import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logo from '@/assets/nimalunda-logo.png';

// Reuses the exact wording of public/terms.html so the policies page and the signup terms never drift apart.
export default function Policies() {
  const [html, setHtml] = useState('');

  useEffect(() => {
    fetch('/terms.html')
      .then((r) => r.text())
      .then((txt) => {
        const doc = new DOMParser().parseFromString(txt, 'text/html');
        const main = doc.querySelector('main');
        main?.querySelectorAll('script, button, .page-header, .actions, .accept-bar').forEach((n) => n.remove());
        setHtml(main?.innerHTML ?? '');
      });
    document.title = 'Terms & Policies · NIMALUNDA';
  }, []);

  return (
    <div className="h-dvh overflow-y-auto bg-background">
      <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link to="/"><ArrowLeft className="mr-1 h-4 w-4" /> Back</Link>
        </Button>
        <header className="mb-8 flex items-center gap-4 rounded-2xl border-2 border-primary/30 bg-card p-6">
          <img src={logo} alt="NIMALUNDA logo" className="h-14 w-14 rounded-full" />
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-semibold">
              <ShieldCheck className="h-6 w-6 text-primary" /> Terms & Policies
            </h1>
            <p className="text-sm text-muted-foreground">Effective 7 October 2026 · How NIMALUNDA works with you</p>
          </div>
        </header>
        <article
          className="space-y-4 text-sm leading-relaxed text-foreground/90 sm:text-base
            [&_h2]:mt-8 [&_h2]:border-b [&_h2]:border-border [&_h2]:pb-2 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground
            [&_h3]:mt-4 [&_h3]:font-semibold [&_h3]:text-foreground
            [&_p]:my-3 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1
            [&_a]:text-primary [&_a]:underline-offset-2 hover:[&_a]:underline
            [&_.toc]:rounded-xl [&_.toc]:border [&_.toc]:border-border [&_.toc]:bg-muted/40 [&_.toc]:p-5 [&_.toc_h2]:mt-0 [&_.toc_h2]:border-0"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
