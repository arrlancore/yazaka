"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import DoaList from "./DoaList";
import SearchBar from "./SearchBar";
import { DoaTabType } from "@/types/doa";
import { categorizeDoaForTabs } from "@/services/doaServices";

const DoaTabs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<DoaTabType>("sehari-hari");
  
  const doaByTabs = categorizeDoaForTabs();

  return (
    <Card className="mx-4 mt-4 p-4">
      <SearchBar 
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Cari doa berdasarkan situasi..."
      />
      
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as DoaTabType)}
        className="mt-4"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sehari-hari">Sehari-hari</TabsTrigger>
          <TabsTrigger value="situasional">Situasional</TabsTrigger>
          <TabsTrigger value="favorit">Favorit</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sehari-hari" className="mt-4">
          <DoaList 
            doaList={doaByTabs["sehari-hari"]} 
            searchQuery={searchQuery}
            tabType="sehari-hari"
          />
        </TabsContent>
        
        <TabsContent value="situasional" className="mt-4">
          <DoaList 
            doaList={doaByTabs.situasional} 
            searchQuery={searchQuery}
            tabType="situasional"
          />
        </TabsContent>
        
        <TabsContent value="favorit" className="mt-4">
          <DoaList 
            doaList={doaByTabs.favorit} 
            searchQuery={searchQuery}
            tabType="favorit"
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default DoaTabs;