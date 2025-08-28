'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          router.push('/admin/auth?error=callback_error');
          return;
        }

        if (data.session) {
          // Check if user has admin role
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', data.session.user.id)
            .single();

          if (profile?.role === 'admin') {
            router.push('/admin');
          } else {
            router.push('/unauthorized');
          }
        } else {
          router.push('/admin/auth');
        }
      } catch (error) {
        console.error('Unexpected error in auth callback:', error);
        router.push('/admin/auth?error=unexpected_error');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
}