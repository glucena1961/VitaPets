import React, { createContext, useState, useEffect, useContext, PropsWithChildren } from 'react';
import { supabase } from '@/src/lib/supabase';
import { Session, User } from '@supabase/supabase-js';

// 1. Define la forma de los datos del contexto
interface AuthContextData {
  session: Session | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  signUp: (data: any) => Promise<void>;
}

// 2. Crea el contexto
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// 3. Crea un hook personalizado
export const useAuth = () => {
  return useContext(AuthContext);
};

// 4. Crea el componente Proveedor
export const AuthProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (e) {
        console.error("Error fetching session:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async ({ email, password }: any) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Error logging in:', error.message);
      throw error;
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
      throw error;
    }
  };

  const signUp = async ({ email, password, fullName }: any) => {
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    if (error) {
      console.error('Error signing up:', error.message);
      throw error;
    }
  };

  const value = {
    session,
    user,
    isAuthenticated: !!session,
    isLoading,
    login,
    logout,
    signUp,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
