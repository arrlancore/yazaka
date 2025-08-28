"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Github } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import withSuspense from "@/lib/with-suspense";

const _AuthForm = () => {
  const { user, loading: authContextLoading, signInWithGitHub } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(false);

  // Add client-side only rendering flag
  const [isClient, setIsClient] = useState(false);
  const [searchParamsData, setSearchParamsData] = useState({
    error: null as string | null,
    errorDescription: null as string | null,
  });

  // Extract search params data only on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const errorParam = urlParams.get("error");
      const errorDescriptionParam = urlParams.get("error_description");

      setSearchParamsData({
        error: errorParam,
        errorDescription: errorDescriptionParam,
      });
    }
  }, []);

  // Display OAuth errors if present
  useEffect(() => {
    if (searchParamsData.error && isClient) {
      let errorMessage = "Authentication failed";

      switch (searchParamsData.error) {
        case "session_exchange_failed":
          errorMessage = "Failed to establish session. Please try again.";
          break;
        case "unexpected_error":
          errorMessage = "An unexpected error occurred. Please try again.";
          break;
        case "access_denied":
          errorMessage =
            "Access was denied. Please authorize the application to continue.";
          break;
        default:
          errorMessage =
            searchParamsData.errorDescription ||
            searchParamsData.error ||
            "Authentication failed";
      }

      toast({
        title: "Authentication Error",
        description: errorMessage,
        variant: "destructive",
      });

      // Clear error from URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("error");
      newUrl.searchParams.delete("error_description");
      window.history.replaceState({}, "", newUrl.toString());
    }
  }, [
    searchParamsData.error,
    searchParamsData.errorDescription,
    isClient,
    toast,
  ]);

  // Mark that we're on the client - this prevents hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // REDIRECTION LOGIC:
  // This effect handles redirecting the user if they are authenticated.
  useEffect(() => {
    if (user && !authContextLoading && isClient) {
      const currentSearchParams = new URLSearchParams(window.location.search);
      const redirectTo = currentSearchParams.get("redirect") || "/search";
      router.push(redirectTo);
    }
  }, [user, authContextLoading, isClient, router]);

  const handleGitHubSignIn = async () => {
    setAuthLoading(true);
    const { error } = await signInWithGitHub();

    if (error) {
      toast({
        title: "GitHub Sign-In Failed",
        description: error.message,
        variant: "destructive",
      });
    }
    setAuthLoading(false);
  };

  // LOADING STATE RENDERING:
  if (authContextLoading || !isClient) {
    return (
      <div className="w-full max-w-md">
        <div className="border shadow-sm rounded-lg">
          <div className="p-6 space-y-4">
            <div className="text-center space-y-2">
              <div className="animate-pulse bg-muted h-8 w-32 mx-auto rounded"></div>
              <div className="animate-pulse bg-muted h-4 w-48 mx-auto rounded"></div>
            </div>
            <div className="animate-pulse bg-muted h-10 w-full rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // USER ALREADY AUTHENTICATED:
  if (user) {
    return (
      <div className="w-full max-w-md text-center p-8">Redirecting...</div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <Card className="border shadow-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            Welcome to CollectionKnowledge
          </CardTitle>
          <CardDescription>
            Sign in with GitHub to access your personalized knowledge base
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            type="button"
            className="w-full"
            onClick={handleGitHubSignIn}
            disabled={authLoading}
            size="lg"
          >
            {authLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <Github className="mr-2 h-5 w-5" />
                Continue with GitHub
              </>
            )}
          </Button>

          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              Secure authentication powered by Supabase
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const AuthForm = withSuspense(
  _AuthForm,
  <Loader2 className="animate-spin" />
);
