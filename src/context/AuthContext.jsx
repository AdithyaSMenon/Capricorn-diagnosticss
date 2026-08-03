import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let subscription = null;

    async function initAuth() {
      try {
        const { data } = await supabase.auth.getSession();
        setUser(data?.session?.user ?? null);
      } catch (err) {
        console.warn("Supabase auth error (unconfigured DB):", err);
      } finally {
        setLoading(false);
      }

      try {
        const res = supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user ?? null);
        });
        subscription = res?.data?.subscription;
      } catch (err) {
        console.warn("Auth listener error:", err);
      }
    }

    initAuth();

    return () => {
      if (subscription?.unsubscribe) subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    try {
      return await supabase.auth.signInWithPassword({ email, password });
    } catch (err) {
      return { error: err };
    }
  };

  const logout = () => {
    try {
      return supabase.auth.signOut();
    } catch (err) {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
