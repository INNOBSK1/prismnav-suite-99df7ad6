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
import { Eye, EyeOff, User, Lock, Mail } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import fbmsLogo from '@/assets/fbms.png';

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
  const [showPassword, setShowPassword] = useState(false);
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
      {/* Left side - Green farm background overlay */}
      <div
        className="hidden lg:flex flex-col justify-center items-center p-12 text-white relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(27, 94, 32, 0.92) 0%, rgba(46, 125, 50, 0.85) 50%, rgba(76, 175, 80, 0.78) 100%)',
        }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.3), transparent)' }} />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.2), transparent)' }} />

        <div className="relative z-10 text-center space-y-6 max-w-md">
          <img src={fbmsLogo} alt="FBMS Logo" className="w-32 h-32 mx-auto drop-shadow-2xl" />
          <div>
            <h1 className="text-4xl font-display font-bold tracking-tight">
              Farm Based Management System
            </h1>
            <p className="mt-3 text-lg opacity-90 font-light">
              Cultivating Success Through Technology
            </p>
          </div>
          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 text-left">
              <span className="text-2xl">🌾</span>
              <span className="text-sm font-medium">{t.auth.feature1}</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 text-left">
              <span className="text-2xl">📊</span>
              <span className="text-sm font-medium">{t.auth.feature2}</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 text-left">
              <span className="text-2xl">📱</span>
              <span className="text-sm font-medium">{t.auth.feature3}</span>
            </div>
          </div>
          <p className="text-xs opacity-60 pt-6">{t.auth.footerText}</p>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="flex items-center justify-center p-8 bg-background relative">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
        <div className="w-full max-w-sm space-y-6">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-4">
            <img src={fbmsLogo} alt="FBMS Logo" className="w-20 h-20 mx-auto mb-2" />
            <h1 className="font-display text-xl font-bold text-primary">Farm Based Management System</h1>
            <p className="text-sm text-primary/70">Cultivating Success Through Technology</p>
          </div>

          <div className="space-y-1">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-primary">
              {t.auth.getStarted}
            </h2>
            <p className="text-muted-foreground text-sm">{t.auth.enterDetails}</p>
          </div>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-11 p-1" style={{ background: 'rgba(76, 175, 80, 0.1)', border: '1px solid rgba(76, 175, 80, 0.2)' }}>
              <TabsTrigger
                value="signin"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary rounded-md text-sm font-medium"
              >
                {t.auth.signIn}
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary rounded-md text-sm font-medium"
              >
                {t.auth.signUp}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="mt-5">
              <form onSubmit={handleSignIn} className="space-y-4 bg-card p-6 rounded-2xl shadow-lg border border-primary/20">
                <div className="space-y-1.5">
                  <Label htmlFor="signin-email" className="text-sm font-medium flex items-center gap-2 text-foreground/80">
                    <Mail className="w-4 h-4 text-primary" />
                    {t.auth.emailLabel}
                  </Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder={t.auth.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 bg-muted/30 border-border focus:border-primary focus:ring-primary/20 transition-colors rounded-lg"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="signin-password" className="text-sm font-medium flex items-center gap-2 text-foreground/80">
                    <Lock className="w-4 h-4 text-primary" />
                    {t.auth.passwordLabel}
                  </Label>
                  <div className="relative">
                    <Input
                      id="signin-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 bg-muted/30 border-border focus:border-primary focus:ring-primary/20 transition-colors rounded-lg pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full h-11 font-semibold text-white rounded-lg shadow-md hover:shadow-lg transition-all"
                  style={{ background: 'linear-gradient(135deg, #2E7D32, #4CAF50)' }}
                  disabled={isLoading}
                >
                  {isLoading ? t.auth.signingIn : t.auth.continueBtn}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-5">
              <form onSubmit={handleSignUp} className="space-y-4 bg-card p-6 rounded-2xl shadow-lg border border-primary/20">
                <div className="space-y-1.5">
                  <Label htmlFor="signup-name" className="text-sm font-medium flex items-center gap-2 text-foreground/80">
                    <User className="w-4 h-4 text-primary" />
                    {t.auth.fullNameLabel}
                  </Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder={t.auth.fullNamePlaceholder}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-11 bg-muted/30 border-border focus:border-primary focus:ring-primary/20 transition-colors rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="signup-email" className="text-sm font-medium flex items-center gap-2 text-foreground/80">
                    <Mail className="w-4 h-4 text-primary" />
                    {t.auth.emailLabel}
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder={t.auth.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 bg-muted/30 border-border focus:border-primary focus:ring-primary/20 transition-colors rounded-lg"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="signup-password" className="text-sm font-medium flex items-center gap-2 text-foreground/80">
                    <Lock className="w-4 h-4 text-primary" />
                    {t.auth.passwordLabel}
                  </Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t.auth.passwordPlaceholder}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 bg-muted/30 border-border focus:border-primary focus:ring-primary/20 transition-colors rounded-lg pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full h-11 font-semibold text-white rounded-lg shadow-md hover:shadow-lg transition-all"
                  style={{ background: 'linear-gradient(135deg, #2E7D32, #4CAF50)' }}
                  disabled={isLoading}
                >
                  {isLoading ? t.auth.creatingAccount : t.auth.createAccount}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="text-center text-xs text-muted-foreground">{t.auth.termsText}</p>
        </div>
      </div>
    </div>
  );
}
