import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuthForm } from "./client";

export const metadata: Metadata = {
  title: "Authentication - CollectionKnowledge",
  description: "Sign in or create a new account to access CollectionKnowledge",
};

export default function AuthPage({
  searchParams,
}: {
  searchParams: { authKey?: string };
}) {
  // Server-side check for authKey
  const authKey = searchParams.authKey;
  const expectedKey = process.env.AUTH_KEY;

  if (!authKey || (expectedKey && authKey !== expectedKey)) {
    notFound();
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] py-12">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">CollectionKnowledge</h1>
          <p className="text-muted-foreground mt-2">
            Find solutions instantly with AI-powered search
          </p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}
