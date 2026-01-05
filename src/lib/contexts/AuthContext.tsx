'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/database.types';
import { useRouter } from 'next/navigation';

type Contractor = Database['public']['Tables']['contractors']['Row'];

interface AuthContextType {
  user: User | null;
  contractor: Contractor | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshContractor: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [contractor, setContractor] = useState<Contractor | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const fetchContractor = useCallback(
    async (userId: string) => {
      // eslint-disable-next-line no-console
      console.log('[AUTH CONTEXT] Fetching contractor for user:', userId);

      try {
        // Add timeout to prevent hanging forever (30s to handle slow first query)
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Query timeout after 30 seconds')), 30000)
        );

        const queryPromise = supabase
          .from('contractors')
          .select('*')
          .eq('user_id', userId)
          .single();

        const { data, error } = (await Promise.race([
          queryPromise,
          timeoutPromise,
        ])) as Awaited<typeof queryPromise>;

        // eslint-disable-next-line no-console
        console.log('[AUTH CONTEXT] Query result - data:', !!data, 'error:', error);

        if (error) {
          // eslint-disable-next-line no-console
          console.error('[AUTH CONTEXT] Failed to fetch contractor:', error);
          setContractor(null);
        } else if (data) {
          // eslint-disable-next-line no-console
          console.log('[AUTH CONTEXT] Contractor fetched successfully');
          setContractor(data);
        } else {
          // eslint-disable-next-line no-console
          console.warn(
            '[AUTH CONTEXT] No contractor data and no error - this should not happen'
          );
          setContractor(null);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[AUTH CONTEXT] Exception while fetching contractor:', err);
        setContractor(null);
      }
    },
    [supabase]
  );

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      // eslint-disable-next-line no-console
      console.log('[AUTH CONTEXT] Initial session check:', session?.user?.email);
      // eslint-disable-next-line no-console
      console.log('[AUTH CONTEXT] Email confirmed:', session?.user?.email_confirmed_at);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchContractor(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchContractor(session.user.id);
      } else {
        setContractor(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase, fetchContractor]);

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setContractor(null);
    router.push('/contractor/login');
  }, [supabase, router]);

  const refreshContractor = useCallback(async () => {
    if (user) {
      await fetchContractor(user.id);
    }
  }, [user, fetchContractor]);

  const contextValue = useMemo(
    () => ({
      user,
      contractor,
      loading,
      signOut: handleSignOut,
      refreshContractor,
    }),
    [user, contractor, loading, handleSignOut, refreshContractor]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
