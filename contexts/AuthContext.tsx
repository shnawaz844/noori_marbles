import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { User } from '@supabase/supabase-js';

type Role = 'customer' | 'admin' | null;

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
  const [role, setRole] = useState<Role>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    const checkUser = async () => {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchRole(session.user.id);
      } else {
        setRole(null);
      }
      setIsLoading(false);
    };

    checkUser();

    // Listen for changes on auth state (log in, log out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchRole(session.user.id);
        } else {
          setRole(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching user role:', error.message);
        setRole('customer'); // Default to customer if error (e.g. no profile yet)
      } else if (data) {
        setRole(data.role as Role);
      }
    } catch (err) {
      console.error('Failed to fetch role:', err);
      setRole('customer');
    }
  };

  const logout = async () => {
    // Preserve noori-cart
    const savedCart = localStorage.getItem('noori-cart');

    await supabase.auth.signOut({ scope: 'global' });

    // Clear every token and cached session data from local and session storage
    localStorage.clear();
    sessionStorage.clear();

    // Restore noori-cart
    if (savedCart) {
      localStorage.setItem('noori-cart', savedCart);
    }

    // onAuthStateChange will fire and set user/role to null automatically.
    // Use replace so the user can't go back to a protected page.
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
