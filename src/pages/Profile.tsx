import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setFullName(data.full_name || '');
        setBio(data.bio || '');
        setAvatarUrl(data.avatar_url || '');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error(t.profile.loadError);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          full_name: fullName,
          bio: bio,
          avatar_url: avatarUrl,
        });

      if (error) throw error;
      toast.success(t.profile.updateSuccess);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(t.profile.updateError);
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="container max-w-2xl py-8">
        <div className="text-center">{t.profile.loading}</div>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>{t.profile.title}</CardTitle>
          <CardDescription>{t.profile.manageAccount}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="text-lg">
                {fullName ? fullName.split(' ').map(n => n[0]).join('') : user?.email?.[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t.profile.email}</Label>
            <Input
              id="email"
              type="email"
              value={user?.email || ''}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">{t.profile.fullName}</Label>
            <Input
              id="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t.profile.fullNamePlaceholder}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">{t.profile.bio}</Label>
            <Input
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={t.profile.bioPlaceholder}
            />
          </div>

          <div className="flex gap-4">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? t.profile.saving : t.profile.saveChanges}
            </Button>
            <Button variant="destructive" onClick={handleSignOut}>
              {t.profile.signOut}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
