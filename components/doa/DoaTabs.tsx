"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import DoaList from "./DoaList";
import SearchBar from "./SearchBar";
import { DoaTabType, DoaItem } from "@/types/doa";
import { getFavoriteIds } from "@/lib/doa-client-utils";

interface DoaTabsProps {
  initialDoaByTabs: Record<DoaTabType, DoaItem[]>;
}

const DoaTabs: React.FC<DoaTabsProps> = ({ initialDoaByTabs }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<DoaTabType>("sehari-hari");
  const [doaByTabs, setDoaByTabs] = useState(initialDoaByTabs);
  
  // Update favorites from localStorage
  const updateFavorites = () => {
    const favoriteSlugs = new Set(getFavoriteIds());
    const updatedTabs = { ...initialDoaByTabs };
    updatedTabs.favorit = initialDoaByTabs.semua.filter(doa => favoriteSlugs.has(doa.slug));
    setDoaByTabs(updatedTabs);
  };

  useEffect(() => {
    // Initialize favorites on mount
    updateFavorites();
    
    // Listen for favorite changes
    const handler = () => {
      updateFavorites();
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('doa-favorites-changed' as any, handler);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('doa-favorites-changed' as any, handler);
      }
    };
  }, [initialDoaByTabs]);

  return (
    <Card className="p-4 border-0 shadow-none">
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
          <TabsTrigger value="semua">Semua</TabsTrigger>
          <TabsTrigger value="favorit">Favorit</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sehari-hari" className="mt-4">
          <DoaList 
            doaList={doaByTabs["sehari-hari"]} 
            searchQuery={searchQuery}
            tabType="sehari-hari"
          />
        </TabsContent>
        
        <TabsContent value="semua" className="mt-4">
          <DoaList 
            doaList={doaByTabs.semua} 
            searchQuery={searchQuery}
            tabType="semua"
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