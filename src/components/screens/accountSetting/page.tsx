'use client';

import { useState, useEffect } from 'react';
import Button from "@/components/ui/Button";
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';
import { useProfileQuery } from '@/lib/api/queries/user';
import { useUpdateProfileMutation, useChangePasswordMutation } from '@/lib/api/mutations/user';

export default function SettingsPage() {
  // Tab state
  const [activeTab, setActiveTab] = useState('account');
  
  // Queries & Mutations
  const { data: profileData } = useProfileQuery();
  const updateProfileMutation = useUpdateProfileMutation();
  const changePasswordMutation = useChangePasswordMutation();
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    company: '',
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Subscription info (would come from API)
  const subscriptionInfo = {
    planName: 'Business Pro',
    billingCycle: 'Monthly',
    nextPaymentDate: 'June 15, 2025',
    paymentMethod: 'Visa ending in 4242'
  };

  // Load profile data
  useEffect(() => {
    if (profileData?.data) {
      setProfileForm({
        name: profileData.data.name,
        email: profileData.data.email,
        company: profileData.data.companyName ?? '',
      });
    }
  }, [profileData]);

  // Handlers
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({
      name: profileForm.name,
      companyName: profileForm.company,
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate password match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords don't match. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    // Validate password length
    if (passwordForm.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long.",
        variant: "destructive"
      });
      return;
    }
    
    changePasswordMutation.mutate({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
      confirmPassword: passwordForm.confirmPassword
    }, {
      onSuccess: () => {
        // Reset form on success
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      },
      onError: (error: any) => {
        // Remove the duplicate toast notification
      }
    });
  };

  return (
    <div className="container max-w-5xlpx-4">
      <h1 className="text-3xl font-bold mb-1">Settings</h1>
      <p className="text-gray-500 mb-6">Manage your account settings and preferences</p>
      
      <Tabs defaultValue="account" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>
        
        {/* ACCOUNT TAB */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account information and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
                    <AvatarFallback>{profileForm.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm" type="button">
                    Change Picture
                  </Button>
                </div>
              
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name" 
                      name="name"
                      value={profileForm.name}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email"
                      type="email"
                      value={profileForm.email}
                      onChange={handleProfileChange}
                      required
                      readOnly
                      disabled
                      className="bg-gray-100 cursor-not-allowed"
                      onClick={() => {
                        toast({
                          title: "Email cannot be changed",
                          description: "Email address is linked to your account and cannot be modified.",
                          variant: "default",
                        });
                      }}
                    />
                    <p className="text-xs text-gray-500">Email cannot be changed</p>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="company">Company</Label>
                    <Input 
                      id="company" 
                      name="company"
                      value={profileForm.company}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="mt-6 bg-black hover:bg-gray-800 text-white"
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* PASSWORD TAB */}
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input 
                    id="currentPassword" 
                    name="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input 
                    id="newPassword" 
                    name="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input 
                    id="confirmPassword" 
                    name="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="mt-6 bg-black hover:bg-gray-800 text-white"
                  disabled={changePasswordMutation.isPending}
                >
                  {changePasswordMutation.isPending ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* NOTIFICATIONS TAB */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                {/* Notification settings would go here */}
                <p className="text-gray-500">Notification preferences will be available soon.</p>
                
                <Button 
                  type="submit" 
                  className="mt-6 bg-black hover:bg-gray-800 text-white"
                >
                  Save Preferences
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* SUBSCRIPTION TAB */}
        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Details</CardTitle>
              <CardDescription>Manage your subscription plan and billing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Current Plan</h3>
                    <p className="mt-1 text-base font-medium">{subscriptionInfo.planName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Billing Cycle</h3>
                    <p className="mt-1 text-base font-medium">{subscriptionInfo.billingCycle}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Next Payment</h3>
                    <p className="mt-1 text-base font-medium">{subscriptionInfo.nextPaymentDate}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Payment Method</h3>
                    <p className="mt-1 text-base font-medium">{subscriptionInfo.paymentMethod}</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Button variant="outline">Update Payment Method</Button>
                  <Button variant="outline">View Billing History</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}