import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
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

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Invalid email or password');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success('Signed in successfully!');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
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

      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          toast.error('An account with this email already exists');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success('Account created successfully!');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
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
          <h1 className="font-display text-3xl font-semibold tracking-tight">🌿 FBMS</h1>
          <p className="text-sm opacity-80 mt-1">Farm Business Management System</p>
        </div>
        
        <div className="relative z-10 space-y-6">
          <div className="space-y-4">
            <p className="text-4xl font-display leading-snug">
              Helping farmers grow smarter, not harder.
            </p>
            <p className="text-base leading-relaxed opacity-80">
              FBMS gives you the tools to track your farm's performance, manage resources, and make better decisions — all in one place.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
              <span className="text-lg">🌾</span>
              <span className="text-sm font-medium">Track crops, livestock & inventory</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
              <span className="text-lg">📊</span>
              <span className="text-sm font-medium">Monitor expenses & revenue</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
              <span className="text-lg">📱</span>
              <span className="text-sm font-medium">Access reports & insights anytime</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-sm opacity-70">
          <span>Built for farmers, by people who care 💚</span>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-sm space-y-8">
          <div className="lg:hidden text-center mb-8">
            <h1 className="font-display text-2xl font-semibold text-primary">FBMS</h1>
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-3xl font-semibold tracking-tight">
              Get started
            </h2>
            <p className="text-muted-foreground">
              Enter your details to continue
            </p>
          </div>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-11 p-1 bg-muted/50">
              <TabsTrigger 
                value="signin" 
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md text-sm"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md text-sm"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="mt-6">
              <form onSubmit={handleSignIn} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-sm font-medium">
                    Email address
                  </Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 bg-muted/30 border-border/50 focus:bg-background transition-colors"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 bg-muted/30 border-border/50 focus:bg-background transition-colors"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-11 font-medium shadow-warm hover:shadow-lg transition-all" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Continue'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-6">
              <form onSubmit={handleSignUp} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-sm font-medium">
                    Full name
                  </Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Your name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-11 bg-muted/30 border-border/50 focus:bg-background transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-sm font-medium">
                    Email address
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 bg-muted/30 border-border/50 focus:bg-background transition-colors"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 bg-muted/30 border-border/50 focus:bg-background transition-colors"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-11 font-medium shadow-warm hover:shadow-lg transition-all" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating account...' : 'Create account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="text-center text-xs text-muted-foreground pt-4">
            By continuing, you agree to our terms of service
          </p>
        </div>
      </div>
    </div>
  );
}