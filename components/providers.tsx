"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { OneSignalProvider } from "./pwa/OneSignalProvider";

const queryClient = new QueryClient();

const Providers = (props: any) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <OneSignalProvider>
          {props.children}
        </OneSignalProvider>
      </QueryClientProvider>
    </>
  );
};

export default Providers;
