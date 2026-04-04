import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        setLoading(true); // ✅ ensure loading starts

        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
          console.error('Auth error:', error);
          setUser(null);
          setIsAdmin(false);
          return;
        }

        setUser(user);

        if (user) {
          const { data: adminData, error: adminError } = await supabase
            .from('admin_users')
            .select('id')
            .eq('id', user.id)
            .maybeSingle();

          if (adminError) {
            console.error('Admin check error:', adminError);
            setIsAdmin(false);
          } else {
            setIsAdmin(!!adminData);
          }
        } else {
          setIsAdmin(false);
        }

      } catch (error) {
        console.error('Error checking user:', error);
        setUser(null);
        setIsAdmin(false);
      } finally {
        setLoading(false); // ✅ ALWAYS STOP LOADING
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        try {
          setLoading(true); // ✅ FIX loading flicker

          const currentUser = session?.user ?? null;
          setUser(currentUser);

          if (currentUser) {
            const { data: adminData, error: adminError } = await supabase
              .from('admin_users')
              .select('id')
              .eq('id', currentUser.id)
              .maybeSingle();

            if (adminError) {
              console.error('Admin check error:', adminError);
              setIsAdmin(false);
            } else {
              setIsAdmin(!!adminData);
            }
          } else {
            setIsAdmin(false);
          }

        } catch (err) {
          console.error('Auth state error:', err);
          setUser(null);
          setIsAdmin(false);
        } finally {
          setLoading(false); // ✅ FIX infinite loading
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // ✅ FIX: RETURN USER
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return { user: data.user }; // ✅ IMPORTANT
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    setUser(null);       // ✅ cleanup
    setIsAdmin(false);   // ✅ cleanup
  };

  return { user, loading, isAdmin, signIn, signOut };
};
