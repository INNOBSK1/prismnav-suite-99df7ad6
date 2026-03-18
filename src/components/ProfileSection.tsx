import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/i18n/LanguageContext";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";

export function ProfileSection() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => { if (user) loadProfile(); }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', user?.id).single();
      if (error && error.code !== 'PGRST116') throw error;
      if (data) { setFullName(data.full_name || ''); setBio(data.bio || ''); setAvatarUrl(data.avatar_url || ''); }
    } catch (error) { console.error('Error loading profile:', error); toast.error(t.profile.loadError); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from('profiles').upsert({ id: user?.id, full_name: fullName, bio, avatar_url: avatarUrl });
      if (error) throw error;
      toast.success(t.profile.updateSuccess);
    } catch (error) { console.error('Error updating profile:', error); toast.error(t.profile.updateError); }
    finally { setSaving(false); }
  };

  const handleSignOut = async () => { await supabase.auth.signOut(); navigate('/auth'); };

  const uploadAvatar = async (file: File) => {
    if (!user) return;
    try {
      setUploading(true);
      if (!file.type.startsWith('image/')) { toast.error(t.profile.imageOnly); return; }
      if (file.size > 2 * 1024 * 1024) { toast.error(t.profile.fileTooLarge); return; }
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
      setAvatarUrl(publicUrl);
      const { error: updateError } = await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id);
      if (updateError) throw updateError;
      toast.success(t.profile.avatarSuccess);
    } catch (error) { console.error('Error uploading avatar:', error); toast.error(t.profile.avatarError); }
    finally { setUploading(false); }
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files.length > 0) uploadAvatar(e.dataTransfer.files[0]); };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files && e.target.files.length > 0) uploadAvatar(e.target.files[0]); };

  if (loading) {
    return (
      <Card><CardHeader><CardTitle>{t.profile.title}</CardTitle></CardHeader>
        <CardContent><p className="text-muted-foreground">{t.profile.loading}</p></CardContent></Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" />{t.profile.title}</CardTitle>
        <CardDescription>{t.profile.manageAccount}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className={`flex items-center gap-4 cursor-pointer transition-all ${isDragging ? 'ring-2 ring-primary rounded-lg p-2' : ''}`}
          onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()}>
          <div className="relative group">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="text-lg">{fullName ? fullName.split(' ').map(n => n[0]).join('') : user?.email?.[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 group-hover:opacity-100 rounded-full transition-opacity"><User className="h-6 w-6" /></div>
            {uploading && <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div></div>}
          </div>
          <div className="flex-1">
            <Label className="cursor-pointer">{t.profile.profilePicture}</Label>
            <p className="text-sm text-muted-foreground">{t.profile.uploadHint}</p>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
        </div>
        <div className="space-y-2"><Label htmlFor="email">{t.profile.email}</Label><Input id="email" type="email" value={user?.email || ''} disabled className="bg-muted" /></div>
        <div className="space-y-2"><Label htmlFor="name">{t.profile.fullName}</Label><Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={t.profile.fullNamePlaceholder} /></div>
        <div className="space-y-2"><Label htmlFor="bio">{t.profile.bio}</Label><Input id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder={t.profile.bioPlaceholder} /></div>
        <div className="flex gap-4">
          <Button onClick={handleSave} disabled={saving}>{saving ? t.profile.saving : t.profile.saveChanges}</Button>
          <Button variant="destructive" onClick={handleSignOut}>{t.profile.signOut}</Button>
        </div>
      </CardContent>
    </Card>
  );
}
