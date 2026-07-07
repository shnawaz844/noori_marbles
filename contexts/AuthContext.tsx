import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { User } from '@supabase/supabase-js';

type Role = 'customer' | 'admin' | null;

const ROLE_KEY = 'noori_user_role';
const USER_KEY = 'noori_user_id';

const getStoredRole = (): Role => {
  try {
    return (localStorage.getItem(ROLE_KEY) as Role) ?? null;
  } catch {
    return null;
  }
};

interface AuthContextType {
  user: User | null;
  role: Role;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(getStoredRole);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // getSession() is the guaranteed way to restore session on page load.
    // We call setIsLoading(false) immediately after — never await role fetch.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (!currentUser) {
        // No active session — clear stale cached role
        setRole(null);
        localStorage.removeItem(ROLE_KEY);
        localStorage.removeItem(USER_KEY);
      } else {
        // Fetch role from DB in background (don't block loading)
        fetchAndSetRole(currentUser.id);
      }

      // Always unblock the UI immediately after we know the session state
      setIsLoading(false);
    });

    // Subscribe to future auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (_event === 'INITIAL_SESSION') return; // Already handled by getSession above

      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (!currentUser) {
        setRole(null);
        localStorage.removeItem(ROLE_KEY);
        localStorage.removeItem(USER_KEY);
      } else {
        fetchAndSetRole(currentUser.id);
      }

      setIsLoading(false);
    });

    // Hard safety timeout: ensure we never get stuck on loading screen
    const timeout = setTimeout(() => {
      if (mounted) setIsLoading(false);
    }, 3000);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const fetchAndSetRole = async (userId: string, attempt = 1): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error(`fetchRole error (attempt ${attempt}):`, error.message);
        if (attempt < 3) {
          await new Promise(r => setTimeout(r, 500 * attempt));
          return fetchAndSetRole(userId, attempt + 1);
        }
        // Keep cached role on failure — don't overwrite with 'customer'
        return;
      }

      if (data?.role) {
        setRole(data.role as Role);
        localStorage.setItem(ROLE_KEY, data.role);
        localStorage.setItem(USER_KEY, userId);
      }
    } catch (err) {
      console.error(`fetchRole exception (attempt ${attempt}):`, err);
      if (attempt < 3) {
        await new Promise(r => setTimeout(r, 500 * attempt));
        return fetchAndSetRole(userId, attempt + 1);
      }
    }
  };

  const logout = async () => {
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(USER_KEY);

    const savedCart = localStorage.getItem('noori-cart');

    await supabase.auth.signOut({ scope: 'global' });

    localStorage.clear();
    sessionStorage.clear();

    if (savedCart) {
      localStorage.setItem('noori-cart', savedCart);
    }

    window.location.replace('/login');
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, role, isAuthenticated, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
