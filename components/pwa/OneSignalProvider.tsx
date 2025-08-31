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

  const ONESIGNAL_APP_ID = appId || process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;

  const initializeOneSignal = async (): Promise<void> => {
    if (!ONESIGNAL_APP_ID) {
      console.error("OneSignal App ID not found in environment variables");
      return;
    }

    if (isInitialized) return;

    try {
      await OneSignal.init({
        appId: ONESIGNAL_APP_ID,
        safari_web_id: process.env.NEXT_PUBLIC_ONESIGNAL_SAFARI_WEB_ID,
        allowLocalhostAsSecureOrigin: process.env.NODE_ENV === "development",
        serviceWorkerPath: "/sw.js",
        serviceWorkerParam: { scope: "/" },
        notificationClickHandlerMatch: "origin",
        notificationClickHandlerAction: "navigate",
      });

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

      // The 'change' event listener in initializeOneSignal will handle setting state.
      // We can directly check the current state after permission is granted.
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Allow time for state to settle

      const optedIn = OneSignal.User.PushSubscription.optedIn;
      if (optedIn) {
        const subscriptionId = OneSignal.User.PushSubscription.id;
        setPlayerId(subscriptionId ?? null);
        setIsSubscribed(true);
        console.log("User subscribed with Subscription ID:", subscriptionId);
        return subscriptionId ?? null;
      }

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
    if (!isInitialized || !playerId) return;

    try {
      OneSignal.User.addTags({
        timezone: preferences.timezone || "Asia/Jakarta",
        reminderMinutes: preferences.reminderMinutes?.toString() || "10",
        playSound: preferences.sound ? "true" : "false",
        enableVibration: preferences.vibrate ? "true" : "false",
        prayerReminders: preferences.prayerReminders ? "true" : "false",
      });

      console.log("OneSignal user preferences updated:", preferences);
    } catch (error) {
      console.error("Error updating OneSignal user preferences:", error);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && ONESIGNAL_APP_ID) {
      const checkAndInit = async () => {
        if ("Notification" in window && Notification.permission === "granted") {
          await initializeOneSignal();
        }
      };

      checkAndInit();
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
