"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import DoaList from "./DoaList";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";
import { DoaTabType, DoaItem } from "@/types/doa";
import { getFavoriteIds } from "@/lib/doa-client-utils";

interface DoaTabsProps {
  initialDoaByTabs: Record<DoaTabType, DoaItem[]>;
}

const DoaTabs: React.FC<DoaTabsProps> = ({ initialDoaByTabs }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DoaTabType>("sehari-hari");
  const [doaByTabs, setDoaByTabs] = useState(initialDoaByTabs);
  
  // Simple approach: use local state for input, URL for persistence only
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || "");
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();
  
  // Initialize from URL only once on mount
  useEffect(() => {
    const urlQuery = searchParams.get('q') || "";
    if (urlQuery !== searchQuery) {
      setSearchQuery(urlQuery);
    }
  }, []); // Empty dependency - only run on mount
  
  const showSearchResults = searchQuery.trim().length >= 2;
  
  // Update search with debounced URL persistence
  const updateSearchQuery = useCallback((newQuery: string) => {
    // Update local state immediately
    setSearchQuery(newQuery);
    
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // Debounce URL update by 500ms
    debounceTimeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      if (newQuery.trim()) {
        params.set('q', newQuery);
      } else {
        params.delete('q');
      }
      const newUrl = `/doa${params.toString() ? '?' + params.toString() : ''}`;
      router.replace(newUrl, { scroll: false });
    }, 500);
  }, [router]);

  // Clear search function
  const clearSearch = useCallback(() => {
    setSearchQuery("");
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    router.replace('/doa', { scroll: false });
  }, [router]);
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);
  
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
        onChange={updateSearchQuery}
        placeholder="Cari doa berdasarkan situasi..."
      />
      
      {showSearchResults ? (
        <div className="mt-4">
          <SearchResults 
            doaList={doaByTabs.semua}
            searchQuery={searchQuery}
            onClearSearch={clearSearch}
          />
        </div>
      ) : (
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
              searchQuery=""
              tabType="sehari-hari"
            />
          </TabsContent>
          
          <TabsContent value="semua" className="mt-4">
            <DoaList 
              doaList={doaByTabs.semua} 
              searchQuery=""
              tabType="semua"
            />
          </TabsContent>
          
          <TabsContent value="favorit" className="mt-4">
            <DoaList 
              doaList={doaByTabs.favorit} 
              searchQuery=""
              tabType="favorit"
            />
          </TabsContent>
        </Tabs>
      )}
    </Card>
  );
};

export default DoaTabs;