import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-6">
          <AlertCircle className="h-20 w-20 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">
            You don't have permission to access the admin panel. 
            Please contact an administrator if you believe this is an error.
          </p>
        </div>
        <div className="space-y-3">
          <Button asChild>
            <Link href="/">Return to Homepage</Link>
          </Button>
          <br />
          <Button variant="outline" asChild>
            <Link href="/admin/auth">Try Different Account</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}