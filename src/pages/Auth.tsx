import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/i18n/LanguageContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { toast } from 'sonner';

const authSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  fullName: z.string().optional(),
});

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const validation = authSchema.safeParse({ email, password });
      if (!validation.success) {
        toast.error(validation.error.errors[0].message);
        return;
      }
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message.includes('Invalid login credentials') ? t.auth.invalidCredentials : error.message);
      } else {
        toast.success(t.auth.signedIn);
      }
    } catch {
      toast.error(t.auth.unexpectedError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const validation = authSchema.safeParse({ email, password, fullName });
      if (!validation.success) {
        toast.error(validation.error.errors[0].message);
        return;
      }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: { full_name: fullName },
        },
      });
      if (error) {
        toast.error(error.message.includes('already registered') ? t.auth.accountExists : error.message);
      } else {
        toast.success(t.auth.accountCreated);
      }
    } catch {
      toast.error(t.auth.unexpectedError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Branding */}
      <div className="hidden lg:flex flex-col justify-between p-12 text-primary-foreground relative overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(195 70% 36%), hsl(152 55% 38%), hsl(185 60% 30%))' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, hsl(142 55% 50% / 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(195 70% 50% / 0.3) 0%, transparent 50%)' }} />
        <div className="relative z-10">
          <h1 className="font-display text-3xl font-semibold tracking-tight">{t.auth.brandName}</h1>
          <p className="text-sm opacity-80 mt-1">{t.auth.brandSubtitle}</p>
        </div>
        <div className="relative z-10 space-y-6">
          <div className="space-y-4">
            <p className="text-4xl font-display leading-snug">{t.auth.heroTitle}</p>
            <p className="text-base leading-relaxed opacity-80">{t.auth.heroDescription}</p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
              <span className="text-lg">🌾</span>
              <span className="text-sm font-medium">{t.auth.feature1}</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
              <span className="text-lg">📊</span>
              <span className="text-sm font-medium">{t.auth.feature2}</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
              <span className="text-lg">📱</span>
              <span className="text-sm font-medium">{t.auth.feature3}</span>
            </div>
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-2 text-sm opacity-70">
          <span>{t.auth.footerText}</span>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="flex items-center justify-center p-8 bg-background relative">
        <div className="absolute top-4 right-4">
          <LanguageSwitcher />
        </div>
        <div className="w-full max-w-sm space-y-8">
          <div className="lg:hidden text-center mb-8">
            <h1 className="font-display text-2xl font-semibold text-primary">FBMS</h1>
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-3xl font-semibold tracking-tight">{t.auth.getStarted}</h2>
            <p className="text-muted-foreground">{t.auth.enterDetails}</p>
          </div>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-11 p-1 bg-muted/50">
              <TabsTrigger value="signin" className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md text-sm">{t.auth.signIn}</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md text-sm">{t.auth.signUp}</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="mt-6">
              <form onSubmit={handleSignIn} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-sm font-medium">{t.auth.emailLabel}</Label>
                  <Input id="signin-email" type="email" placeholder={t.auth.emailPlaceholder} value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 bg-muted/30 border-border/50 focus:bg-background transition-colors" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-sm font-medium">{t.auth.passwordLabel}</Label>
                  <Input id="signin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 bg-muted/30 border-border/50 focus:bg-background transition-colors" required />
                </div>
                <Button type="submit" className="w-full h-11 font-medium shadow-warm hover:shadow-lg transition-all" disabled={isLoading}>
                  {isLoading ? t.auth.signingIn : t.auth.continueBtn}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-6">
              <form onSubmit={handleSignUp} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-sm font-medium">{t.auth.fullNameLabel}</Label>
                  <Input id="signup-name" type="text" placeholder={t.auth.fullNamePlaceholder} value={fullName} onChange={(e) => setFullName(e.target.value)} className="h-11 bg-muted/30 border-border/50 focus:bg-background transition-colors" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-sm font-medium">{t.auth.emailLabel}</Label>
                  <Input id="signup-email" type="email" placeholder={t.auth.emailPlaceholder} value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 bg-muted/30 border-border/50 focus:bg-background transition-colors" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-sm font-medium">{t.auth.passwordLabel}</Label>
                  <Input id="signup-password" type="password" placeholder={t.auth.passwordPlaceholder} value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 bg-muted/30 border-border/50 focus:bg-background transition-colors" required />
                </div>
                <Button type="submit" className="w-full h-11 font-medium shadow-warm hover:shadow-lg transition-all" disabled={isLoading}>
                  {isLoading ? t.auth.creatingAccount : t.auth.createAccount}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="text-center text-xs text-muted-foreground pt-4">{t.auth.termsText}</p>
        </div>
      </div>
    </div>
  );
}
