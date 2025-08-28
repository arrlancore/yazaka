"use client";
import React, {
  createContext,
  use,
  useContext,
  useEffect,
  useState,
} from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  signInWithGitHub: () => Promise<{ error: any }>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Track component mount state
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  const refreshUser = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
    setIsAuthenticated(!!data.user);
  };

  // Sign in with GitHub
  const signInWithGitHub = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/en/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      return { error };
    } catch (err: any) {
      if (isMounted) {
        toast({
          description: "An error occurred: " + err.message,
          variant: "destructive",
        });
      }
      return { error: err };
    }
  };

  useEffect(() => {
    // Set up the auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      const currentUser = currentSession?.user ?? null;
      setUser(currentUser);
      setIsAuthenticated(!!currentUser);
      // DO NOT set loading here for onAuthStateChange,
      // as initial loading is handled by getSession()
    });

    // 1. Get the initial session. This is the primary driver for initial loading state.
    supabase.auth
      .getSession()
      .then(({ data: { session: initialSession } }) => {
        setSession(initialSession);
        const currentUser = initialSession?.user ?? null;
        setUser(currentUser);
        setIsAuthenticated(!!currentUser);
        setLoading(false); // <--- SET LOADING FALSE HERE, AFTER INITIAL SESSION IS FETCHED
      })
      .catch((error) => {
        console.error("Error getting initial session:", error);
        setLoading(false); // Also set loading false on error
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      // Perform logout without showing toasts during the critical logout process
      const { error } = await supabase.auth.signOut();

      // Only show error toast if there's an actual error and component is mounted
      if (error && isMounted) {
        console.error("Logout error:", error);
        toast({
          description: "Error during logout: " + error.message,
          variant: "destructive",
        });
      }

      // Don't show success toast - the auth state change will handle the redirect
      // This prevents DOM manipulation errors when the page is transitioning
    } catch (err: any) {
      console.error("Unexpected logout error:", err);
      // Only show error toast if component is still mounted
      if (isMounted) {
        toast({
          description: "Unexpected error during logout",
          variant: "destructive",
        });
      }
    } finally {
      setIsAuthenticated(false);
      router.replace("/auth");
    }
  };

  const value = {
    session,
    user,
    loading,
    signOut,
    refreshUser,
    signInWithGitHub,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
