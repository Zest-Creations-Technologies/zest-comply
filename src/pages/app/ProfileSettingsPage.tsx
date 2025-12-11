import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Calendar, Shield } from 'lucide-react';

export default function ProfileSettingsPage() {
  const { user } = useAuth();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground">
          View and manage your account information
        </p>
      </div>

      {/* Profile info */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your personal details and account status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-foreground">{user?.full_name || 'User'}</h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Email</Label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{user?.email}</span>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Member Since</Label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">
                  {user?.created_at ? formatDate(user.created_at) : 'N/A'}
                </span>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Current Plan</Label>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <Badge variant="secondary">Professional</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Placeholder for future profile editing */}
      <Card className="bg-card border-dashed">
        <CardHeader>
          <CardTitle className="text-muted-foreground">Profile Updates</CardTitle>
          <CardDescription>
            Profile editing features coming soon. You'll be able to update your name, 
            change your password, and manage notification preferences.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
