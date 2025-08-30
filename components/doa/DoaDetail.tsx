"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { DoaItem } from "@/types/doa";
import DoaCard from "@/components/doa/DoaCard";

interface DoaDetailProps {
  doa: DoaItem;
}

const DoaDetail: React.FC<DoaDetailProps> = ({ doa }) => {
  return (
    <>
      {/* Header */}
      <div
        className={cn(
          "sticky top-0 z-10 bg-gradient-to-r from-primary to-primary-light text-primary-foreground",
          "transition-all duration-300 px-4 py-3 shadow-md sm:rounded-t-[2rem]"
        )}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/doa">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-white/20"
              >
                <ArrowLeft size={20} />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-bold">{doa.nama}</h1>
              <p className="text-sm text-primary-foreground/80">{doa.grup}</p>
            </div>
          </div>
          <div />
        </div>
      </div>

      {/* Content */}
      <div className="mx-4 mt-4 space-y-6">
        <DoaCard index={1} doa={doa} />
        <div className="pb-8" />
      </div>
    </>
  );
};

export default DoaDetail;

