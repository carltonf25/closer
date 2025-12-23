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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [contractor, setContractor] = useState<Contractor | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const fetchContractor = useCallback(
    async (userId: string) => {
      const { data, error } = await supabase
        .from('contractors')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Failed to fetch contractor:', error);
        setContractor(null);
      } else {
        setContractor(data);
      }
    },
    [supabase]
  );

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
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
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
