"use client";

import React from "react";
import { DoaItem } from "@/types/doa";
import DoaCard from "@/components/doa/DoaCard";

interface DoaDetailProps {
  doa: DoaItem;
}

const DoaDetail: React.FC<DoaDetailProps> = ({ doa }) => {
  return (
    <div className="space-y-6">
      <DoaCard index={1} doa={doa} />
      <div className="pb-8" />
    </div>
  );
};

export default DoaDetail;

