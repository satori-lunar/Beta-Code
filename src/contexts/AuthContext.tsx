import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// DEMO MODE: Set to true to bypass Supabase auth (for testing only)
const DEMO_MODE = false;

const DEMO_USER: User = {
  id: 'demo-user-123',
  email: 'demo@example.com',
  app_metadata: {},
  user_metadata: { name: 'Demo User' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
} as User;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: Error | null; needsConfirmation?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithMagicLink: (email: string) => Promise<{ error: Error | null; message?: string }>;
  signInPasswordless: (email: string) => Promise<{ error: Error | null; requiresPassword?: boolean }>;
  resetPassword: (email: string) => Promise<{ error: Error | null; message?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(DEMO_MODE ? DEMO_USER : null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(!DEMO_MODE);

  useEffect(() => {
    if (DEMO_MODE) {
      setLoading(false);
      return;
    }

    // CRITICAL: Force loading to false after 2 seconds max to prevent infinite spinner
    const timeout = setTimeout(() => {
      try {
        if (typeof window !== 'undefined' && window.innerWidth > 768) {
          console.warn('⚠️ AuthContext: Force setting loading to false after timeout');
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    }, 2000);

    // Get initial session
    supabase.auth.getSession()
      .then(async ({ data: { session } }) => {
        clearTimeout(timeout);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Track login is handled in onAuthStateChange below
        
        setLoading(false);
        try {
          if (typeof window !== 'undefined' && window.innerWidth > 768) {
            console.log('✅ AuthContext: Session loaded', session?.user?.id || 'no user');
          }
        } catch (err) {
          // Ignore logging errors
        }
      })
      .catch((err) => {
        clearTimeout(timeout);
        // Supabase unavailable - continue without auth
        try {
          if (typeof window !== 'undefined' && window.innerWidth > 768) {
            console.error('❌ AuthContext: Error getting session', err);
          }
        } catch (logErr) {
          // Ignore logging errors
        }
        setLoading(false);
      });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event: any, session: any) => {
        try {
          if (typeof window !== 'undefined' && window.innerWidth > 768) {
            console.log('🔄 AuthContext: Auth state changed', _event, session?.user?.id || 'no user');
          }
        } catch (err) {
          // Ignore logging errors
        }
        setSession(session);
        setUser(session?.user ?? null);
        
        // Track login when session is established (don't block on this)
        if (session?.user && _event === 'SIGNED_IN') {
          // Fire and forget - don't block UI
          Promise.resolve(supabase.from('user_logins').insert({
            user_id: session.user.id,
            login_at: new Date().toISOString(),
            user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null
          })).then(() => {
            // Success - no action needed
          }).catch((error: unknown) => {
            // Ignore tracking errors - don't log as error, just warn
            try {
              if (typeof window !== 'undefined' && window.innerWidth > 768) {
                console.warn('Could not track login (non-critical):', error);
              }
            } catch (logErr) {
              // Ignore logging errors
            }
          });
        }
        
        setLoading(false);
      }
    );

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    if (DEMO_MODE) {
      setUser(DEMO_USER);
      return { error: null, needsConfirmation: false };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/`
      }
    });
    
    // If email confirmation is disabled in Supabase, a session will be returned immediately
    // If enabled, no session will be returned and user needs to confirm email
    const needsConfirmation = data?.user && !data?.session ? true : undefined;
    
    // If session exists, user is automatically signed in (email confirmation disabled)
    if (data?.session) {
      setSession(data.session);
      setUser(data.session.user);
    }
    
    return { error, needsConfirmation };
  };

  const signIn = async (email: string, password: string) => {
    if (DEMO_MODE) {
      setUser(DEMO_USER);
      return { error: null };
    }
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { error };
  };

  const signInWithMagicLink = async (email: string) => {
    if (DEMO_MODE) {
      setUser(DEMO_USER);
      return { error: null, message: 'Magic link sent (demo mode)' };
    }
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/`
      }
    });
    if (error) {
      return { error, message: error.message };
    }
    return { error: null, message: 'Check your email for the magic link!' };
  };

  const signInPasswordless = async (email: string) => {
    if (DEMO_MODE) {
      setUser(DEMO_USER);
      return { error: null, requiresPassword: false };
    }

    try {
      // Call Edge Function for passwordless auth
      let supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

      if (!supabaseUrl || !anonKey) {
        return { error: new Error('Supabase configuration is missing. Please check your environment variables.'), requiresPassword: false };
      }

      // Ensure URL doesn't end with a slash to avoid double slashes
      supabaseUrl = supabaseUrl.replace(/\/$/, '');
      const functionUrl = `${supabaseUrl}/functions/v1/passwordless-auth`;
      
      // Log for debugging (only in development)
      if (import.meta.env.DEV) {
        console.log('🔐 Attempting passwordless auth:', { email, functionUrl: functionUrl.replace(/\/\/.*@/, '//***@') });
      }

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${anonKey}`
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        // Handle HTTP errors
        if (response.status === 404) {
          return { 
            error: new Error(
              'The passwordless authentication service is not deployed. ' +
              'Please deploy the Edge Function "passwordless-auth" to your Supabase project. ' +
              'Run: supabase functions deploy passwordless-auth'
            ), 
            requiresPassword: false 
          };
        }
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          return { error: new Error(errorData.error || errorData.message || 'Authentication failed'), requiresPassword: false };
        } catch {
          return { error: new Error(`Authentication failed: ${response.status} ${response.statusText}`), requiresPassword: false };
        }
      }

      const data = await response.json();

      if (data?.error) {
        return { error: new Error(data.error || 'Authentication failed'), requiresPassword: false };
      }

      if (data?.requiresPassword) {
        return { error: null, requiresPassword: true };
      }

      if (!data?.token) {
        return { error: new Error('No authentication token received'), requiresPassword: false };
      }

      // Use the token to sign in
      const { error: signInError } = await supabase.auth.verifyOtp({
        email,
        token: data.token,
        type: 'email'
      });

      if (signInError) {
        return { error: signInError, requiresPassword: false };
      }

      return { error: null, requiresPassword: false };
    } catch (err: any) {
      // Handle network errors (failed to fetch)
      if (err?.message?.includes('fetch') || err?.name === 'TypeError' || err?.message?.includes('Failed to fetch')) {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
        return { 
          error: new Error(
            `Unable to connect to authentication service at ${supabaseUrl}/functions/v1/passwordless-auth. ` +
            'The Edge Function may not be deployed. Please deploy it using: supabase functions deploy passwordless-auth'
          ), 
          requiresPassword: false 
        };
      }
      return { error: new Error(err?.message || 'Failed to authenticate'), requiresPassword: false };
    }
  };

  const resetPassword = async (email: string) => {
    if (DEMO_MODE) {
      return { error: null, message: 'Password reset email sent (demo mode)' };
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    if (error) {
      return { error, message: error.message };
    }
    return { error: null, message: 'Check your email for the password reset link!' };
  };

  const signOut = async () => {
    if (DEMO_MODE) {
      setUser(null);
      return;
    }
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signInWithMagicLink, signInPasswordless, resetPassword, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}