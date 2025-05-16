
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

const AccountPage = () => {
  const { user, signOut, isLoading } = useAuth();
  const [profile, setProfile] = useState<Tables<'profiles'> | null>(null);
  const [fetchingProfile, setFetchingProfile] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setProfile(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setFetchingProfile(false);
      }
    };
    
    getProfile();
  }, [user]);

  // Redirect to login if not authenticated
  if (!user && !isLoading) {
    return <Navigate to="/auth" />;
  }

  // Show loading state
  if (isLoading || fetchingProfile) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="animate-pulse">Loading account information...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Account</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile?.avatar_url ?? ''} alt={profile?.display_name ?? user?.email ?? ''} />
              <AvatarFallback>{profile?.display_name?.charAt(0) ?? user?.email?.charAt(0) ?? 'U'}</AvatarFallback>
            </Avatar>
            
            <div>
              <h2 className="text-xl font-semibold">{profile?.display_name || 'Welcome!'}</h2>
              <p className="text-gray-500">{user?.email}</p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Account Information</h3>
            <p className="text-gray-600">Email: {user?.email}</p>
            {profile?.display_name && <p className="text-gray-600">Name: {profile.display_name}</p>}
          </div>
        </div>
        
        <div className="space-y-4">
          <Button variant="outline" className="w-full">Order History</Button>
          <Button variant="outline" className="w-full">Saved Addresses</Button>
          <Button variant="outline" className="w-full">Payment Methods</Button>
          <Button onClick={signOut} variant="destructive" className="w-full">Sign Out</Button>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
