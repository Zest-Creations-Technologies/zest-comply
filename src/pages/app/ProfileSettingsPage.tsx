import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/lib/api/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Calendar, Shield, Eye, EyeOff, CheckCircle2, XCircle, Loader2, Download, Camera, Trash2, KeyRound, Smartphone, AlertTriangle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { z } from 'zod';

const profileSchema = z.object({
  first_name: z.string().max(100, 'First name must be less than 100 characters').optional(),
  last_name: z.string().max(100, 'Last name must be less than 100 characters').optional(),
});

const passwordSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[a-z]/, 'Must contain lowercase letter')
    .regex(/[0-9]/, 'Must contain a number')
    .regex(/[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/, 'Must contain special character'),
  confirm_password: z.string(),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
}).refine((data) => data.current_password !== data.new_password, {
  message: "New password must be different from current password",
  path: ['new_password'],
});

const passwordRequirements = [
  { key: 'length', label: '8 characters', regex: /.{8,}/ },
  { key: 'uppercase', label: 'Uppercase', regex: /[A-Z]/ },
  { key: 'lowercase', label: 'Lowercase', regex: /[a-z]/ },
  { key: 'number', label: 'Number', regex: /[0-9]/ },
  { key: 'special', label: 'Special char', regex: /[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/ },
];

export default function ProfileSettingsPage() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Delete account state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Profile form state
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [exportLoading, setExportLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // MFA state
  const [mfaPassword, setMfaPassword] = useState('');
  const [mfaActionLoading, setMfaActionLoading] = useState<'enable' | 'disable' | null>(null);
  const [totpDialogOpen, setTotpDialogOpen] = useState(false);
  const [totpStep, setTotpStep] = useState<'password' | 'scan'>('password');
  const [totpPassword, setTotpPassword] = useState('');
  const [totpSetup, setTotpSetupData] = useState<{ secret: string; otpauth_uri: string } | null>(null);
  const [totpCode, setTotpCode] = useState('');
  const [totpLoading, setTotpLoading] = useState(false);
  const [totpError, setTotpError] = useState<string | null>(null);
  const [disableTotpLoading, setDisableTotpLoading] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getPasswordStrength = (password: string): number => {
    let strength = 0;
    passwordRequirements.forEach(req => {
      if (req.regex.test(password)) strength++;
    });
    return strength;
  };

  const strengthLevel = getPasswordStrength(newPassword);
  const strengthColor = strengthLevel <= 2 ? 'bg-destructive' : strengthLevel <= 4 ? 'bg-yellow-500' : 'bg-green-500';

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);

    const result = profileSchema.safeParse({ first_name: firstName, last_name: lastName });
    if (!result.success) {
      setProfileError(result.error.errors[0]?.message || 'Invalid input');
      return;
    }

    setProfileLoading(true);
    try {
      await authApi.updateProfile({
        first_name: firstName || undefined,
        last_name: lastName || undefined,
      });
      await refreshUser();
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error) {
      const message = error?.detail || error?.message || 'Failed to update profile';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Maximum size is 5MB.', variant: 'destructive' });
      return;
    }
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      toast({ title: 'Unsupported format', description: 'Only PNG and JPEG are supported.', variant: 'destructive' });
      return;
    }
    setAvatarLoading(true);
    try {
      await authApi.uploadAvatar(file);
      await refreshUser();
      toast({ title: 'Profile picture updated' });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setAvatarLoading(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  const handleAvatarDelete = async () => {
    setAvatarLoading(true);
    try {
      await authApi.deleteAvatar();
      await refreshUser();
      toast({ title: 'Profile picture removed' });
    } catch (error) {
      toast({
        title: 'Could not remove picture',
        description: error?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setAvatarLoading(false);
    }
  };

  const resetDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeletePassword('');
    setDeleteConfirmText('');
    setDeleteError(null);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      setDeleteError('Type DELETE to confirm.');
      return;
    }
    if (!deletePassword) {
      setDeleteError('Enter your password to confirm.');
      return;
    }
    setDeleteError(null);
    setDeleteLoading(true);
    try {
      await authApi.deleteMyAccount({ password: deletePassword });
      window.dispatchEvent(new CustomEvent('auth:logout'));
      toast({ title: 'Account deleted', description: 'Your account has been permanently deleted.' });
      navigate('/', { replace: true });
    } catch (error) {
      const status = error?.status;
      if (status === 429) {
        setDeleteError('Too many attempts. Please wait 15 minutes before trying again.');
      } else {
        setDeleteError(error?.message || 'Incorrect password.');
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleExportData = async () => {
    setExportLoading(true);
    try {
      await authApi.exportMyData();
      toast({ title: 'Export ready', description: 'Your data export has started downloading.' });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: error?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setExportLoading(false);
    }
  };

  const handleEnableEmailMfa = async () => {
    if (!mfaPassword) {
      toast({ title: 'Password required', description: 'Enter your password to continue.', variant: 'destructive' });
      return;
    }
    setMfaActionLoading('enable');
    try {
      const response = await authApi.enableMfa({ password: mfaPassword });
      await refreshUser();
      setMfaPassword('');
      toast({ title: 'Two-factor authentication enabled', description: response.message });
    } catch (error) {
      toast({ title: 'Could not enable MFA', description: error?.message || 'Please try again.', variant: 'destructive' });
    } finally {
      setMfaActionLoading(null);
    }
  };

  const handleDisableMfa = async () => {
    if (!mfaPassword) {
      toast({ title: 'Password required', description: 'Enter your password to continue.', variant: 'destructive' });
      return;
    }
    setMfaActionLoading('disable');
    try {
      const response = await authApi.disableMfa({ password: mfaPassword });
      await refreshUser();
      setMfaPassword('');
      toast({ title: 'Two-factor authentication disabled', description: response.message });
    } catch (error) {
      toast({ title: 'Could not disable MFA', description: error?.message || 'Please try again.', variant: 'destructive' });
    } finally {
      setMfaActionLoading(null);
    }
  };

  const resetTotpDialog = () => {
    setTotpDialogOpen(false);
    setTotpStep('password');
    setTotpPassword('');
    setTotpSetupData(null);
    setTotpCode('');
    setTotpError(null);
  };

  const handleStartTotpSetup = async () => {
    if (!totpPassword) {
      setTotpError('Enter your password to continue.');
      return;
    }
    setTotpError(null);
    setTotpLoading(true);
    try {
      const setup = await authApi.setupTotp({ password: totpPassword });
      setTotpSetupData(setup);
      setTotpStep('scan');
    } catch (error) {
      setTotpError(error?.message || 'Incorrect password.');
    } finally {
      setTotpLoading(false);
    }
  };

  const handleConfirmTotpSetup = async () => {
    if (!/^\d{6}$/.test(totpCode)) {
      setTotpError('Enter the 6-digit code from your authenticator app.');
      return;
    }
    setTotpError(null);
    setTotpLoading(true);
    try {
      await authApi.verifyTotpSetup({ code: totpCode });
      await refreshUser();
      toast({ title: 'Authenticator app enabled', description: 'Two-factor authentication is now required at login.' });
      resetTotpDialog();
    } catch (error) {
      setTotpError(error?.message || 'Invalid or expired code.');
    } finally {
      setTotpLoading(false);
    }
  };

  const handleDisableTotp = async () => {
    if (!mfaPassword) {
      toast({ title: 'Password required', description: 'Enter your password to continue.', variant: 'destructive' });
      return;
    }
    setDisableTotpLoading(true);
    try {
      const response = await authApi.disableTotp({ password: mfaPassword });
      await refreshUser();
      setMfaPassword('');
      toast({ title: 'Authenticator app disabled', description: response.message });
    } catch (error) {
      toast({ title: 'Could not disable authenticator app', description: error?.message || 'Please try again.', variant: 'destructive' });
    } finally {
      setDisableTotpLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErrors({});

    const result = passwordSchema.safeParse({
      current_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    });

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setPasswordErrors(errors);
      return;
    }

    setPasswordLoading(true);
    try {
      const response = await authApi.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      toast({
        title: 'Password changed',
        description: response.message || 'Your password has been updated. Other devices will need to log in again.',
      });
      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      const status = error?.status_code || error?.status;
      const message = error?.detail || error?.message || 'Failed to change password';
      
      if (status === 429) {
        toast({
          title: 'Too many attempts',
          description: 'Please wait 15 minutes before trying again.',
          variant: 'destructive',
        });
      } else if (status === 400 && message.toLowerCase().includes('current password')) {
        setPasswordErrors({ current_password: 'Current password is incorrect' });
      } else {
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground">
          View and manage your account information
        </p>
      </div>

      {/* Account Information */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your personal details and account status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-16 w-16">
                {user?.avatar_url && <AvatarImage src={user.avatar_url} alt={user.full_name || user.email} />}
                <AvatarFallback className="bg-primary/10 text-primary">
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              {avatarLoading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/70">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-foreground">{user?.full_name || 'User'}</h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <div className="mt-2 flex items-center gap-2">
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/png,image/jpeg"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={avatarLoading}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={avatarLoading}
                >
                  <Camera className="mr-2 h-3.5 w-3.5" />
                  Change photo
                </Button>
                {user?.avatar_url && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleAvatarDelete}
                    disabled={avatarLoading}
                  >
                    <Trash2 className="mr-2 h-3.5 w-3.5" />
                    Remove
                  </Button>
                )}
              </div>
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
              <Label>Email Status</Label>
              <div className="flex items-center gap-2">
                {user?.email_verified ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <Badge variant="secondary">
                      Verified
                    </Badge>
                    {user?.email_verified_at && (
                      <span className="text-xs text-muted-foreground">
                        on {formatDate(user.email_verified_at)}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="outline">
                      Unverified
                    </Badge>
                  </>
                )}
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
                <Badge variant="secondary">
                  {user?.user_plan?.plan?.name || 'No Plan'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Data &amp; Privacy</CardTitle>
          <CardDescription>Export everything tied to your account - profile, evidence, compliance packages, governance records, and your audit history.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={handleExportData} disabled={exportLoading}>
            {exportLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            Export my data
          </Button>
        </CardContent>
      </Card>

      {/* Edit Profile */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>Update your name</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  maxLength={100}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  maxLength={100}
                />
              </div>
            </div>
            {profileError && (
              <p className="text-sm text-destructive">{profileError}</p>
            )}
            <div className="flex justify-end">
              <Button type="submit" disabled={profileLoading}>
                {profileLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your account password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="grid gap-4">
              {/* Current Password */}
              <div className="grid gap-2">
                <Label htmlFor="current_password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current_password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    aria-invalid={!!passwordErrors.current_password}
                    aria-describedby={passwordErrors.current_password ? "current_password-error" : undefined}
                    className={passwordErrors.current_password ? 'border-destructive' : ''}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordErrors.current_password && (
                  <p id="current_password-error" className="text-sm text-destructive">{passwordErrors.current_password}</p>
                )}
              </div>

              {/* New Password */}
              <div className="grid gap-2">
                <Label htmlFor="new_password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new_password"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    aria-invalid={!!passwordErrors.new_password}
                    aria-describedby={passwordErrors.new_password ? "new_password-error" : undefined}
                    className={passwordErrors.new_password ? 'border-destructive' : ''}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordErrors.new_password && (
                  <p id="new_password-error" className="text-sm text-destructive">{passwordErrors.new_password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="grid gap-2">
                <Label htmlFor="confirm_password">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirm_password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    aria-invalid={!!passwordErrors.confirm_password}
                    aria-describedby={passwordErrors.confirm_password ? "confirm_password-error" : undefined}
                    className={passwordErrors.confirm_password ? 'border-destructive' : ''}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordErrors.confirm_password && (
                  <p id="confirm_password-error" className="text-sm text-destructive">{passwordErrors.confirm_password}</p>
                )}
              </div>
            </div>

            {/* Password Strength */}
            {newPassword && (
              <div className="space-y-3">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${strengthColor}`}
                    style={{ width: `${(strengthLevel / 5) * 100}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {passwordRequirements.map((req) => {
                    const met = req.regex.test(newPassword);
                    return (
                      <div key={req.key} className="flex items-center gap-1.5 text-sm">
                        {met ? (
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        ) : (
                          <XCircle className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className={met ? 'text-foreground' : 'text-muted-foreground'}>
                          {req.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button type="submit" disabled={passwordLoading}>
                {passwordLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Change Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>Require a second code, in addition to your password, when signing in.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-2">
            {user?.mfa_enabled ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <Badge variant="secondary">
                  Enabled &middot; {user.mfa_method === 'totp' ? 'Authenticator app' : 'Email codes'}
                </Badge>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-muted-foreground" />
                <Badge variant="outline">Disabled</Badge>
              </>
            )}
          </div>

          {!user?.mfa_enabled && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border p-4 space-y-3">
                <div className="flex items-center gap-2 font-medium text-foreground">
                  <Smartphone className="h-4 w-4" />
                  Authenticator app
                </div>
                <p className="text-sm text-muted-foreground">
                  Use Google Authenticator, 1Password, or a similar app. Recommended.
                </p>
                <Button type="button" size="sm" onClick={() => setTotpDialogOpen(true)}>
                  Set up authenticator app
                </Button>
              </div>
              <div className="rounded-lg border border-border p-4 space-y-3">
                <div className="flex items-center gap-2 font-medium text-foreground">
                  <Mail className="h-4 w-4" />
                  Email codes
                </div>
                <p className="text-sm text-muted-foreground">
                  We'll email you a one-time code each time you sign in.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="mfa-enable-password">Confirm your password</Label>
                  <Input
                    id="mfa-enable-password"
                    type="password"
                    value={mfaPassword}
                    onChange={(e) => setMfaPassword(e.target.value)}
                  />
                </div>
                <Button type="button" size="sm" variant="outline" onClick={handleEnableEmailMfa} disabled={mfaActionLoading === 'enable'}>
                  {mfaActionLoading === 'enable' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Enable email codes
                </Button>
              </div>
            </div>
          )}

          {user?.mfa_enabled && (
            <div className="space-y-4">
              {user.mfa_method === 'email_otp' && (
                <div className="rounded-lg border border-border p-4 space-y-3">
                  <div className="flex items-center gap-2 font-medium text-foreground">
                    <Smartphone className="h-4 w-4" />
                    Switch to an authenticator app
                  </div>
                  <p className="text-sm text-muted-foreground">
                    More reliable than email - no waiting on a code to arrive.
                  </p>
                  <Button type="button" size="sm" variant="outline" onClick={() => setTotpDialogOpen(true)}>
                    Set up authenticator app
                  </Button>
                </div>
              )}

              <div className="rounded-lg border border-border p-4 space-y-3">
                <div className="flex items-center gap-2 font-medium text-foreground">
                  <KeyRound className="h-4 w-4" />
                  {user.mfa_method === 'totp' ? 'Disable authenticator app' : 'Turn off two-factor authentication'}
                </div>
                <p className="text-sm text-muted-foreground">
                  {user.mfa_method === 'totp'
                    ? "You'll fall back to emailed codes at login."
                    : "You'll only need your password to sign in."}
                </p>
                <div className="space-y-2 max-w-sm">
                  <Label htmlFor="mfa-disable-password">Confirm your password</Label>
                  <Input
                    id="mfa-disable-password"
                    type="password"
                    value={mfaPassword}
                    onChange={(e) => setMfaPassword(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  {user.mfa_method === 'totp' && (
                    <Button type="button" size="sm" variant="outline" onClick={handleDisableTotp} disabled={disableTotpLoading}>
                      {disableTotpLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Switch to email codes
                    </Button>
                  )}
                  <Button type="button" size="sm" variant="destructive" onClick={handleDisableMfa} disabled={mfaActionLoading === 'disable'}>
                    {mfaActionLoading === 'disable' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Turn off two-factor authentication
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/40 bg-card">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Permanently delete your account and personal data.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Your profile, credentials, and two-factor setup are scrubbed and your account is deactivated.
            Evidence, compliance packages, and other data you created for your organization are not affected.
            This cannot be undone.
          </p>
          <Button type="button" variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete my account
          </Button>
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={(open) => { if (!open) resetDeleteDialog(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete your account
            </DialogTitle>
            <DialogDescription>
              This permanently deletes your account. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="delete-password">Confirm your password</Label>
              <Input
                id="delete-password"
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="delete-confirm-text">Type <span className="font-mono font-semibold">DELETE</span> to confirm</Label>
              <Input
                id="delete-confirm-text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
              />
            </div>
            {deleteError && <p className="text-sm text-destructive">{deleteError}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={resetDeleteDialog}>Cancel</Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleteLoading || deleteConfirmText !== 'DELETE' || !deletePassword}
            >
              {deleteLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Permanently delete my account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Authenticator app enrollment dialog */}
      <Dialog open={totpDialogOpen} onOpenChange={(open) => { if (!open) resetTotpDialog(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set up authenticator app</DialogTitle>
            <DialogDescription>
              {totpStep === 'password'
                ? 'Confirm your password to generate a setup key.'
                : 'Scan the QR code with your authenticator app, then enter the 6-digit code it shows.'}
            </DialogDescription>
          </DialogHeader>

          {totpStep === 'password' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="totp-setup-password">Password</Label>
                <Input
                  id="totp-setup-password"
                  type="password"
                  value={totpPassword}
                  onChange={(e) => setTotpPassword(e.target.value)}
                  autoFocus
                />
              </div>
              {totpError && <p className="text-sm text-destructive">{totpError}</p>}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetTotpDialog}>Cancel</Button>
                <Button type="button" onClick={handleStartTotpSetup} disabled={totpLoading}>
                  {totpLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Continue
                </Button>
              </DialogFooter>
            </div>
          )}

          {totpStep === 'scan' && totpSetup && (
            <div className="space-y-4">
              <div className="flex justify-center rounded-lg bg-white p-4">
                <QRCodeSVG value={totpSetup.otpauth_uri} size={180} />
              </div>
              <div className="space-y-1">
                <Label>Can't scan it? Enter this key manually</Label>
                <p className="break-all rounded bg-muted px-2 py-1.5 font-mono text-xs text-muted-foreground">
                  {totpSetup.secret}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="totp-verify-code">6-digit code</Label>
                <Input
                  id="totp-verify-code"
                  type="text"
                  inputMode="numeric"
                  placeholder="123456"
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                />
              </div>
              {totpError && <p className="text-sm text-destructive">{totpError}</p>}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetTotpDialog}>Cancel</Button>
                <Button type="button" onClick={handleConfirmTotpSetup} disabled={totpLoading}>
                  {totpLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Verify &amp; enable
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
