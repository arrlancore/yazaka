"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DailyChecklist from "./DailyChecklist";
import FikihPuasa from "./FikihPuasa";
import DalilDoa from "./DalilDoa";
import Keutamaan from "./Keutamaan";
import AyatPilihan from "./AyatPilihan";

const tabs = [
  { id: "checklist", label: "Checklist" },
  { id: "fikih", label: "Fikih" },
  { id: "doa", label: "Doa" },
  { id: "keutamaan", label: "Keutamaan" },
  { id: "ayat", label: "30 Ayat" },
];

export default function RamadanTabs() {
  return (
    <Tabs defaultValue="checklist" className="w-full">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <TabsList className="flex w-full h-11 rounded-none bg-transparent gap-0 p-0">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex-1 rounded-none text-xs h-full border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <TabsContent value="checklist" className="mt-0 pb-6">
        <DailyChecklist />
      </TabsContent>

      <TabsContent value="fikih" className="mt-0 pb-6">
        <FikihPuasa />
      </TabsContent>

      <TabsContent value="doa" className="mt-0 pb-6">
        <DalilDoa />
      </TabsContent>

      <TabsContent value="keutamaan" className="mt-0 pb-6">
        <Keutamaan />
      </TabsContent>

      <TabsContent value="ayat" className="mt-0 pb-6">
        <AyatPilihan />
      </TabsContent>
    </Tabs>
  );
}
