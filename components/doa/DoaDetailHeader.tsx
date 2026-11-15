"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import HeaderMobilePage from "@/components/ui/header-mobile-page";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

function SearchButton() {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full hover:bg-white/20"
    >
      <Search size={20} />
    </Button>
  );
}

function HeaderWithBack({ title }: { title: string }) {
  const searchParams = useSearchParams();
  // Static export: the search query used to come from the server-side
  // `searchParams` prop; read it on the client instead.
  const q = searchParams.get("back_q");
  const backUrl = q ? `/doa?q=${encodeURIComponent(q)}` : "/doa";

  return (
    <HeaderMobilePage
      title={title}
      backUrl={backUrl}
      rightContent={<SearchButton />}
    />
  );
}

export default function DoaDetailHeader({ title }: { title: string }) {
  return (
    // The fallback (default back URL) is what gets prerendered into the HTML.
    <Suspense
      fallback={
        <HeaderMobilePage
          title={title}
          backUrl="/doa"
          rightContent={<SearchButton />}
        />
      }
    >
      <HeaderWithBack title={title} />
    </Suspense>
  );
}
