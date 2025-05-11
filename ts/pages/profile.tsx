import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Profile() {
  const { user, updateProfile, showWelcomeMessage, setShowWelcomeMessage } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [bio, setBio] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [_, navigate] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Check if this is a new user by looking at the URL params
    const urlParams = new URLSearchParams(window.location.search);
    setIsNewUser(urlParams.get('new') === 'true');

    // Set initial values from user profile
    if (user) {
      setDisplayName(user.displayName || '');
      setPhotoURL(user.photoURL || '');
    }

    // Show welcome modal for new users
    if (showWelcomeMessage) {
      toast({
        title: 'Welcome to Virtual Railway Recruitment!',
        description: 'Please complete your profile to get started.',
        duration: 5000,
      });
      // Reset welcome message flag after showing it
      setShowWelcomeMessage(false);
    }
  }, [user, showWelcomeMessage, setShowWelcomeMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Update profile in Firebase
      await updateProfile(displayName, photoURL);
      
      // Success toast
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
      
      // If this is a new user, redirect to jobs
      if (isNewUser) {
        navigate('/jobs');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: 'Update failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {isNewUser ? 'Complete Your Profile' : 'Your Profile'}
          </h1>
          <p className="text-muted-foreground">
            {isNewUser
              ? 'Add some details to your profile to help us personalize your experience.'
              : 'Update your profile information and preferences.'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="pt-6 flex flex-col items-center">
                <Avatar className="w-32 h-32 mb-4">
                  <AvatarImage src={photoURL || undefined} alt={displayName} />
                  <AvatarFallback className="text-2xl">
                    {displayName ? displayName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-xl mb-1">{displayName || user?.email?.split('@')[0]}</h3>
                <p className="text-muted-foreground text-sm">{user?.email}</p>
                
                {/* Account stats */}
                <div className="w-full border-t mt-6 pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-foreground text-sm">Member since</span>
                    <span className="font-medium">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">Applications</span>
                    <span className="font-medium">0</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Profile form */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and how others see you on the platform
                </CardDescription>
              </CardHeader>
              
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      placeholder="Your name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="photoURL">Profile Picture URL</Label>
                    <Input
                      id="photoURL"
                      placeholder="https://example.com/your-photo.jpg"
                      value={photoURL}
                      onChange={(e) => setPhotoURL(e.target.value)}
                      disabled={isSubmitting}
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter a direct URL to an image. Use services like Imgur for hosting.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us a little about yourself"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      disabled={isSubmitting}
                      rows={4}
                    />
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Spinner size="sm" className="mr-2" /> : null}
                    {isNewUser ? 'Complete Profile' : 'Save Changes'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}