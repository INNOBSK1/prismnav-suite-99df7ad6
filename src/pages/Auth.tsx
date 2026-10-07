import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/i18n/LanguageContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { GoogleTranslate } from '@/components/GoogleTranslate';
import { ThemeToggle } from '@/components/ThemeToggle';
import { toast } from 'sonner';
import { Eye, EyeOff, User, Lock, Mail, ShieldCheck, Sprout, Leaf, LineChart, Store, BookOpen } from 'lucide-react';
import logo from '@/assets/nimalunda-logo.png';

const BRAND = 'NIMALUNDA';

const authSchema = z.object({
  email: z.string().trim().email({ message: 'Please enter a valid email address' }).max(255),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }).max(72),
  fullName: z.string().trim().max(100).optional(),
});

const tools = [
  { icon: Sprout, name: 'Plant Help', key: 'sitePlantHelpDesc' },
  { icon: Leaf, name: `${BRAND} Ani`, key: 'siteAniDesc' },
  { icon: LineChart, name: 'Farm Tracker', key: 'siteFarmTrackerDesc' },
  { icon: Store, name: 'Farm Market', key: 'siteStoreDesc' },
  { icon: BookOpen, name: `${BRAND} Blog`, key: 'siteBlogDesc' },
] as const;

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [termsRead, setTermsRead] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  // Listen to Accept / Decline / Close buttons inside the terms page
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const type = e.data?.type;
      if (type === 'termsAccepted') {
        setTermsRead(true);
        setAgreed(true);
        setTermsOpen(false);
        toast.success('Thanks — you agreed to the Terms & Policies.');
      } else if (type === 'termsDeclined') {
        setAgreed(false);
        setTermsOpen(false);
        toast.error('You must accept the Terms & Policies to create an account.');
      } else if (type === 'termsClosed') {
        setTermsOpen(false);
      }
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = authSchema.safeParse({ email, password });
    if (!v.success) return toast.error(v.error.errors[0].message);
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) toast.error(error.message.includes('Invalid login credentials') ? t.auth.invalidCredentials : error.message);
      else toast.success(t.auth.signedIn);
    } catch {
      toast.error(t.auth.unexpectedError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsRead || !agreed) {
      toast.error('Please read and agree to the Terms & Policies first.');
      setTermsOpen(true);
      return;
    }
    const v = authSchema.safeParse({ email, password, fullName });
    if (!v.success) return toast.error(v.error.errors[0].message);
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: { full_name: fullName.trim(), terms_accepted_at: new Date().toISOString() },
        },
      });
      if (error) toast.error(error.message.includes('already registered') ? t.auth.accountExists : error.message);
      else toast.success(`${t.auth.accountCreated} Check your email to confirm.`);
    } catch {
      toast.error(t.auth.unexpectedError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!z.string().email().safeParse(email.trim()).success) {
      toast.error('Please enter your email above first');
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
        options: { emailRedirectTo: `${window.location.origin}/` },
      });
      if (error) {
        toast.error(error.message);
      } else {
        await supabase.functions.invoke('send-email', {
          body: {
            to: email.trim(),
            subject: `Confirm your ${BRAND} account`,
            html: `<div style="font-family:DM Sans,Arial,sans-serif;padding:24px;color:#1b1b1b">
              <h2 style="color:#166534;margin:0 0 12px">Welcome to ${BRAND} 🌱</h2>
              <p>We just re-sent your confirmation email. Please check your inbox (and spam folder) for the link to verify your account.</p>
              <p>If you didn't request this, you can safely ignore this message.</p>
              <p style="margin-top:24px;color:#666;font-size:13px">— The ${BRAND} Team</p>
            </div>`,
          },
        });
        toast.success('Confirmation email sent! Check your inbox.');
      }
    } catch {
      toast.error(t.auth.unexpectedError);
    } finally {
      setIsLoading(false);
    }
  };

  const onTermsScroll = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    const win = e.currentTarget.contentWindow;
    if (!win) return;
    const check = () => {
      const d = win.document.documentElement;
      if (d.scrollTop + win.innerHeight >= d.scrollHeight - 60) setTermsRead(true);
    };
    win.addEventListener('scroll', check);
  };

  const inputCls = 'h-11 rounded-lg bg-muted/50 pl-10 focus-visible:ring-primary/40 border border-border/50';

  const passwordField = (id: string, withPlaceholder: boolean) => (
    <div className="relative">
      <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        id={id}
        type={showPassword ? 'text' : 'password'}
        placeholder={withPlaceholder ? t.auth.passwordPlaceholder : undefined}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={`${inputCls} pr-10`}
        required
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
      >
        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );

  const emailField = (id: string) => (
    <div className="relative">
      <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input id={id} type="email" placeholder={t.auth.emailPlaceholder} value={email}
        onChange={(e) => setEmail(e.target.value)} className={inputCls} required />
    </div>
  );

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-background">
      {/* Brand side - Left panel */}
      <aside className="hidden lg:flex w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-[hsl(160_70%_7%)] via-[hsl(158_70%_14%)] to-[hsl(158_84%_26%)] p-12 text-primary-foreground relative">
        <div className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full border border-primary-foreground/10 shadow-[0_0_0_45px_hsl(0_0%_100%/0.025),0_0_0_90px_hsl(0_0%_100%/0.02)]" />
        
        {/* Header */}
        <div className="flex items-center gap-3 z-10">
          <img src={logo} alt={`${BRAND} logo`} className="h-10 w-10 rounded-full" />
          <span className="font-display text-lg font-bold tracking-[0.12em]">{BRAND}</span>
        </div>

        {/* Center content - balanced */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 gap-6 py-8">
          <img src={logo} alt="" className="h-32 w-32 rounded-full shadow-2xl" />
          <div className="text-center max-w-sm">
            <h1 className="font-display text-4xl font-bold leading-[1.2] tracking-tight mb-3">{t.auth.heroTitleMain}</h1>
            <p className="text-base opacity-85">{t.auth.heroSubtitleMain}</p>
          </div>
          
          {/* Features list - centered and compact */}
          <ul className="w-full space-y-2 max-w-sm">
            {tools.map(({ icon: Icon, name, key }) => (
              <li key={name} className="flex items-center gap-3 rounded-lg bg-primary-foreground/10 px-3 py-2 backdrop-blur-sm">
                <Icon className="h-4 w-4 shrink-0 opacity-90" />
                <div className="text-left">
                  <span className="block text-xs font-semibold">{name}</span>
                  <span className="text-[11px] opacity-75">{t.auth[key]}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <p className="text-xs opacity-60 z-10">© {new Date().getFullYear()} {BRAND}. {t.auth.authFooter}</p>
      </aside>

      {/* Form side - Right panel */}
      <main className="w-full lg:w-1/2 flex flex-col items-center justify-center overflow-hidden bg-background p-4 sm:p-6 relative">
        {/* Top controls */}
        <div className="absolute right-4 top-4 flex items-center gap-2 z-20">
          <GoogleTranslate />
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

        {/* Form container - centered and scrollable only if needed */}
        <div className="w-full max-w-sm flex flex-col gap-5 max-h-full overflow-y-auto">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 lg:hidden pt-2">
            <img src={logo} alt={`${BRAND} logo`} className="h-10 w-10 rounded-full" />
            <span className="font-display text-lg font-bold tracking-[0.12em] text-primary">{BRAND}</span>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <h2 className="font-display text-2xl font-semibold tracking-tight">{t.auth.getStarted}</h2>
            <p className="text-sm text-muted-foreground">{t.auth.enterDetails}</p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid h-10 w-full grid-cols-2 rounded-lg bg-primary/10 p-0.5">
              <TabsTrigger value="signin" className="rounded-md text-sm data-[state=active]:text-primary">{t.auth.signIn}</TabsTrigger>
              <TabsTrigger value="signup" className="rounded-md text-sm data-[state=active]:text-primary">{t.auth.signUp}</TabsTrigger>
            </TabsList>

            {/* Sign In Tab */}
            <TabsContent value="signin" className="mt-4">
              <form onSubmit={handleSignIn} className="space-y-3 rounded-2xl border border-border bg-card p-5 shadow-lg">
                <div className="space-y-1">
                  <Label htmlFor="signin-email" className="text-sm">{t.auth.emailLabel}</Label>
                  {emailField('signin-email')}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="signin-password" className="text-sm">{t.auth.passwordLabel}</Label>
                  {passwordField('signin-password', false)}
                </div>
                <Button type="submit" className="h-10 w-full rounded-lg font-semibold text-sm" disabled={isLoading}>
                  {isLoading ? t.auth.signingIn : t.auth.continueBtn}
                </Button>
              </form>
            </TabsContent>

            {/* Sign Up Tab */}
            <TabsContent value="signup" className="mt-4">
              <form onSubmit={handleSignUp} className="space-y-3 rounded-2xl border border-border bg-card p-5 shadow-lg">
                <div className="space-y-1">
                  <Label htmlFor="signup-name" className="text-sm">{t.auth.fullNameLabel}</Label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="signup-name" type="text" placeholder={t.auth.fullNamePlaceholder} value={fullName}
                      onChange={(e) => setFullName(e.target.value)} className={inputCls} />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="signup-email" className="text-sm">{t.auth.emailLabel}</Label>
                  {emailField('signup-email')}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="signup-password" className="text-sm">{t.auth.passwordLabel}</Label>
                  {passwordField('signup-password', true)}
                </div>

                {/* Terms agreement */}
                <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/40 p-3 text-xs">
                  <Checkbox
                    id="terms"
                    checked={agreed}
                    onCheckedChange={(v) => {
                      if (!termsRead) {
                        toast.info('Please open and read the Terms & Policies first.');
                        setTermsOpen(true);
                        return;
                      }
                      setAgreed(v === true);
                    }}
                    className="mt-0.5 shrink-0"
                  />
                  <label htmlFor="terms" className="leading-relaxed text-muted-foreground cursor-pointer">
                    I have read and agree to the{' '}
                    <button type="button" onClick={() => setTermsOpen(true)} className="font-semibold text-primary hover:underline">
                      Terms & Policies
                    </button>{' '}
                    of {BRAND}.
                    {!termsRead && <span className="mt-1 block text-[10px]">Must read before agreeing.</span>}
                  </label>
                </div>

                <Button type="submit" className="h-10 w-full rounded-lg font-semibold text-sm" disabled={isLoading || !agreed}>
                  {isLoading ? t.auth.creatingAccount : t.auth.createAccount}
                </Button>
                <div className="text-center">
                  <button type="button" onClick={handleResendConfirmation} disabled={isLoading}
                    className="text-xs font-medium text-primary hover:underline disabled:opacity-50">
                    Didn't receive an email? Resend
                  </button>
                </div>
              </form>
            </TabsContent>
          </Tabs>

          {/* Footer text */}
          <p className="text-center text-xs text-muted-foreground">{t.auth.termsText}</p>
        </div>
      </main>

      {/* Terms Dialog */}
      <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
        <DialogContent className="flex h-[90vh] max-w-4xl flex-col gap-3 p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display">
              <ShieldCheck className="h-5 w-5 text-primary" /> {BRAND} Terms & Policies
            </DialogTitle>
            <DialogDescription>Scroll to the end, then press Accept to continue creating your account.</DialogDescription>
          </DialogHeader>
          <iframe
            src="/terms.html"
            title="Terms of Service"
            onLoad={onTermsScroll}
            className="w-full flex-1 rounded-xl border border-border"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setTermsOpen(false)}>Close</Button>
            <Button
              disabled={!termsRead}
              onClick={() => { setAgreed(true); setTermsOpen(false); }}
            >
              {termsRead ? 'I agree' : 'Scroll to the end to agree'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
