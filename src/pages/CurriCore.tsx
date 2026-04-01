import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Check, X, Search, Users, UserCheck, UserX, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  full_name: string | null;
  created_at: string;
  is_paid: boolean | null;
  is_approved: boolean | null;
  trial_end_date: string | null;
}

export default function CurriCore() {
  const { user, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, created_at, is_paid, is_approved, trial_end_date')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load users');
      return;
    }
    setUsers(data || []);
    setLoading(false);
  };

  const toggleApproval = async (userId: string, currentStatus: boolean | null) => {
    const newStatus = !currentStatus;
    const { error } = await supabase
      .from('profiles')
      .update({ is_approved: newStatus })
      .eq('id', userId);

    if (error) {
      toast.error('Failed to update user');
      return;
    }
    toast.success(newStatus ? 'User approved' : 'User access revoked');
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_approved: newStatus } : u));
  };

  const togglePaid = async (userId: string, currentStatus: boolean | null) => {
    const newStatus = !currentStatus;
    const { error } = await supabase
      .from('profiles')
      .update({ is_paid: newStatus })
      .eq('id', userId);

    if (error) {
      toast.error('Failed to update user');
      return;
    }
    toast.success(newStatus ? 'User set to paid' : 'User set to free');
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_paid: newStatus } : u));
  };

  if (authLoading) return <div className="flex min-h-screen items-center justify-center"><p>Loading...</p></div>;
  if (!user) return <Navigate to="/auth" replace />;

  const filtered = users.filter(u =>
    (u.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
    u.id.toLowerCase().includes(search.toLowerCase())
  );

  const totalUsers = users.length;
  const approvedUsers = users.filter(u => u.is_approved).length;
  const pendingUsers = users.filter(u => !u.is_approved).length;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary">CurriCore</h1>
            <p className="text-sm text-muted-foreground">User Management Console</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{totalUsers}</p>
                <p className="text-xs text-muted-foreground">Total Users</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <UserCheck className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{approvedUsers}</p>
                <p className="text-xs text-muted-foreground">Approved</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <UserX className="h-8 w-8 text-destructive" />
              <div>
                <p className="text-2xl font-bold">{pendingUsers}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Users</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-8 text-muted-foreground">Loading users...</p>
            ) : (
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Trial Ends</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Paid</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map(u => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">{u.full_name || 'No name'}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(u.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {u.trial_end_date ? new Date(u.trial_end_date).toLocaleDateString() : '—'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={u.is_approved ? 'default' : 'destructive'}>
                            {u.is_approved ? 'Approved' : 'Pending'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={u.is_paid ? 'default' : 'secondary'}>
                            {u.is_paid ? 'Paid' : 'Free'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            size="sm"
                            variant={u.is_approved ? 'destructive' : 'default'}
                            onClick={() => toggleApproval(u.id, u.is_approved)}
                          >
                            {u.is_approved ? <X className="h-3 w-3 mr-1" /> : <Check className="h-3 w-3 mr-1" />}
                            {u.is_approved ? 'Revoke' : 'Approve'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => togglePaid(u.id, u.is_paid)}
                          >
                            {u.is_paid ? 'Set Free' : 'Set Paid'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filtered.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No users found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
