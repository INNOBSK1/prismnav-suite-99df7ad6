import { useEffect, useState } from 'react';

// Renders the wording of public/terms.html as plain text so the policies page and signup terms share one source.
export const termsArticleCls = `space-y-4 text-sm leading-relaxed text-foreground/90
  [&_h2]:mt-6 [&_h2]:border-b [&_h2]:border-border [&_h2]:pb-2 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground
  [&_h3]:mt-4 [&_h3]:font-semibold [&_h3]:text-foreground
  [&_p]:my-3 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1
  [&_a]:text-primary [&_.toc]:rounded-xl [&_.toc]:border [&_.toc]:border-border [&_.toc]:bg-muted/40 [&_.toc]:p-4 [&_.toc_h2]:mt-0 [&_.toc_h2]:border-0`;

export function useTermsHtml() {
  const [html, setHtml] = useState('');
  useEffect(() => {
    fetch('/terms.html')
      .then((r) => r.text())
      .then((txt) => {
        const doc = new DOMParser().parseFromString(txt, 'text/html');
        const main = doc.querySelector('main') ?? doc.body;
        main.querySelectorAll('script, style, button, .page-header, .actions, .accept-bar').forEach((n) => n.remove());
        setHtml(main.innerHTML);
      });
  }, []);
  return html;
}
