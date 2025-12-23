'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { resendVerificationEmail } from '@/actions/auth';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle, Mail } from 'lucide-react';

export default function VerifyEmailPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{
    email: string;
    email_confirmed_at?: string;
  } | null>(null);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      setUser(authUser);
      setLoading(false);

      // If verified, redirect to dashboard after 3 seconds
      if (authUser?.email_confirmed_at) {
        setTimeout(() => {
          router.push('/contractor/dashboard');
        }, 3000);
      }
    };

    checkUser();
  }, [supabase, router]);

  const handleResend = async () => {
    setResending(true);
    const result = await resendVerificationEmail();
    setResendMessage(result.message);
    setResending(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-600 mb-4">
            Please log in to verify your email
          </p>
          <a
            href="/contractor/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  if (user.email_confirmed_at) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Email Verified!
          </h1>
          <p className="text-gray-600 mb-4">
            Your email is verified. Redirecting to your dashboard...
          </p>
          <a
            href="/contractor/dashboard"
            className="inline-block bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Continue to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <Mail className="h-16 w-16 text-blue-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Check Your Email
        </h1>
        <p className="text-gray-600 mb-4">
          We sent a verification link to <strong>{user.email}</strong>
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Click the link in the email to verify your account and access your
          dashboard.
        </p>

        <div className="border-t pt-6">
          <p className="text-sm text-gray-600 mb-3">
            Didn&apos;t receive the email?
          </p>
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="bg-gray-100 text-gray-700 py-2 px-6 rounded-lg font-semibold hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resending ? 'Sending...' : 'Resend Verification Email'}
          </button>
          {resendMessage && (
            <p className="text-sm text-green-600 mt-2">{resendMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}
