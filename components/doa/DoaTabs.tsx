"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import DoaList from "./DoaList";
import SearchBar from "./SearchBar";
import { DoaTabType } from "@/types/doa";
import { categorizeDoaForTabs, getFavoriteDoa, getFavoriteGroups } from "@/services/doaServices";

const DoaTabs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<DoaTabType>("sehari-hari");
  
  const doaByTabs = categorizeDoaForTabs();
  const [favorites, setFavorites] = useState(getFavoriteDoa());
  const [favoriteGroups, setFavoriteGroups] = useState(getFavoriteGroups());

  useEffect(() => {
    const handler = () => {
      setFavorites(getFavoriteDoa());
      setFavoriteGroups(getFavoriteGroups());
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('doa-favorites-changed' as any, handler);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('doa-favorites-changed' as any, handler);
      }
    };
  }, []);

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
            doaList={favorites} 
            searchQuery={searchQuery}
            tabType="favorit"
            favoriteGroups={favoriteGroups}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default DoaTabs;