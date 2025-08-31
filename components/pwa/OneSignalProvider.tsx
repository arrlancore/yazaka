"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import OneSignal from "react-onesignal";

interface OneSignalContextType {
  isInitialized: boolean;
  playerId: string | null;
  isSubscribed: boolean;
  initializeOneSignal: () => Promise<void>;
  subscribeUser: () => Promise<string | null>;
  unsubscribeUser: () => Promise<void>;
  updateUserPreferences: (preferences: any) => Promise<void>;
}

const OneSignalContext = createContext<OneSignalContextType | undefined>(
  undefined
);

export const useOneSignal = () => {
  const context = useContext(OneSignalContext);
  if (!context) {
    throw new Error("useOneSignal must be used within a OneSignalProvider");
  }
  return context;
};

interface OneSignalProviderProps {
  children: ReactNode;
  appId?: string;
}

export function OneSignalProvider({ children, appId }: OneSignalProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const ONESIGNAL_APP_ID = appId || 
    (process.env.NODE_ENV === 'development' 
      ? process.env.NEXT_PUBLIC_ONESIGNAL_DEV_APP_ID 
      : process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID);

  const initializeOneSignal = async (): Promise<void> => {
    if (!ONESIGNAL_APP_ID) {
      console.error("OneSignal App ID not found in environment variables");
      return;
    }

    if (isInitialized) {
      console.log("OneSignal already initialized, skipping");
      return;
    }

    // Always perform OneSignal.init; the SDK is idempotent and will handle re-inits safely.

    try {

      await OneSignal.init({
        appId: ONESIGNAL_APP_ID,
        safari_web_id: process.env.NEXT_PUBLIC_ONESIGNAL_SAFARI_WEB_ID,
        allowLocalhostAsSecureOrigin:
          (process.env.NODE_ENV as string) === "development",
        serviceWorkerPath: "/sw.js",
        serviceWorkerParam: { scope: "/" },
        notificationClickHandlerMatch: "origin",
        notificationClickHandlerAction: "navigate",
        // Allow testing on different domains in development
        ...(process.env.NODE_ENV === 'development' && {
          persistNotification: false,
          autoResubscribe: true
        })
      });

      // Immediately read current subscription state after init
      try {
        const optedIn = OneSignal.User.PushSubscription.optedIn;
        const subscriptionId = OneSignal.User.PushSubscription.id;
        setIsSubscribed(!!optedIn);
        setPlayerId(subscriptionId ?? null);
        if (optedIn && subscriptionId) {
          console.log("OneSignal initialized; existing Subscription ID:", subscriptionId);
        }
      } catch (e) {
        console.warn("Unable to read OneSignal subscription state after init", e);
      }

      setIsInitialized(true);

      // Listen for subscription changes using the new API
      OneSignal.User.PushSubscription.addEventListener("change", (change) => {
        console.log("OneSignal subscription changed:", change);
        const isSubscribed = change.current.optedIn;
        setIsSubscribed(isSubscribed);

        if (isSubscribed) {
          const subscriptionId = change.current.id;
          setPlayerId(subscriptionId!);
          console.log("OneSignal Subscription ID:", subscriptionId);
        } else {
          setPlayerId(null);
        }
      });

      // Listen for permission changes
      OneSignal.Notifications.addEventListener(
        "permissionChange",
        (granted) => {
          console.log("OneSignal permission changed:", granted);
        }
      );

      console.log("OneSignal initialized successfully");
    } catch (error) {
      console.error("Error initializing OneSignal:", error);
    }
  };

  const subscribeUser = async (): Promise<string | null> => {
    if (!isInitialized) {
      await initializeOneSignal();
    }

    try {
      // Request notification permission
      await OneSignal.Notifications.requestPermission();

      // Wait up to ~5 seconds for OneSignal to assign a subscription ID
      const maxAttempts = 25;
      for (let i = 0; i < maxAttempts; i++) {
        const optedInNow = OneSignal.User.PushSubscription.optedIn;
        const idNow = OneSignal.User.PushSubscription.id;
        if (optedInNow && idNow) {
          setPlayerId(idNow);
          setIsSubscribed(true);
          console.log("User subscribed with Subscription ID:", idNow);
          return idNow;
        }
        // small delay between polls
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      console.warn("Subscription ID not available after waiting");
      return null;
    } catch (error) {
      console.error("Error subscribing user to OneSignal:", error);
      return null;
    }
  };

  const unsubscribeUser = async (): Promise<void> => {
    if (!isInitialized) return;

    try {
      await OneSignal.User.PushSubscription.optOut();
      // The 'change' listener will update state, but we can also set it immediately.
      setIsSubscribed(false);
      setPlayerId(null);
      console.log("User unsubscribed from OneSignal");
    } catch (error) {
      console.error("Error unsubscribing user from OneSignal:", error);
    }
  };

  const updateUserPreferences = async (preferences: any): Promise<void> => {
    if (!isInitialized || !playerId) {
      console.log("OneSignal not initialized or no player ID, skipping tag update");
      return;
    }

    try {
      // Add a small delay to prevent rapid-fire updates that cause conflicts
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const tags = {
        timezone: preferences.timezone || "Asia/Jakarta",
        reminderMinutes: preferences.reminderMinutes?.toString() || "10",
        playSound: preferences.sound ? "true" : "false",
        enableVibration: preferences.vibrate ? "true" : "false",
        prayerReminders: preferences.prayerReminders ? "true" : "false",
      };

      console.log("Updating OneSignal tags:", tags);
      OneSignal.User.addTags(tags);

      console.log("OneSignal user preferences updated successfully");
    } catch (error) {
      // Don't throw error for tag update failures - they're not critical
      console.warn("Error updating OneSignal user preferences (non-critical):", error);
    }
  };

  useEffect(() => {
    // Auto-initialize OneSignal to check for existing subscriptions
    if (typeof window !== "undefined" && ONESIGNAL_APP_ID) {
      console.log(
        "OneSignal provider mounted, checking for existing subscription..."
      );
      // Auto-initialize to detect existing subscriptions
      initializeOneSignal().catch(console.error);
    }
  }, [ONESIGNAL_APP_ID]);

  const contextValue: OneSignalContextType = {
    isInitialized,
    playerId,
    isSubscribed,
    initializeOneSignal,
    subscribeUser,
    unsubscribeUser,
    updateUserPreferences,
  };

  return (
    <OneSignalContext.Provider value={contextValue}>
      {children}
    </OneSignalContext.Provider>
  );
}
