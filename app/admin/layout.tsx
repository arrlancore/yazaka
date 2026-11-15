"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";

/**
 * Client-side admin guard. The site is a static export, so there is no
 * middleware; unauthenticated visitors to /admin/* (except /admin/auth*) are
 * redirected to /admin/auth after checking the Supabase browser session.
 * This is UX only: real authorization must be enforced by Supabase RLS.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const isAuthRoute = /^\/admin\/auth(\/|$)/.test(pathname);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (isAuthRoute) return;
    let cancelled = false;
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (cancelled) return;
        if (data.session) {
          setAllowed(true);
        } else {
          router.replace("/admin/auth");
        }
      })
      .catch(() => {
        if (!cancelled) router.replace("/admin/auth");
      });
    return () => {
      cancelled = true;
    };
  }, [isAuthRoute, pathname, router]);

  if (isAuthRoute) return <>{children}</>;
  return allowed ? <>{children}</> : null;
}
