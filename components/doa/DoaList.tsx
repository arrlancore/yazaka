"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Heart, Star, Search, ChevronRight, BookOpen, Users } from "lucide-react";
import { DoaItem, DoaTabType, DoaGroup } from "@/types/doa";
import { searchDoa, organizeDoaByTimeline, generateDoaSlug, generateGroupSlug } from "@/services/doaServices";
import Link from "next/link";

interface DoaListProps {
  doaList: DoaItem[];
  searchQuery: string;
  tabType: DoaTabType;
}

const DoaList: React.FC<DoaListProps> = ({ doaList, searchQuery, tabType }) => {
  const filteredDoa = useMemo(() => {
    if (searchQuery.trim() === "") {
      return doaList;
    }
    const searchResults = searchDoa(searchQuery);
    // Extract doa items from search results and filter by current tab
    const searchedDoaItems = searchResults.map(result => result.item);
    return searchedDoaItems.filter(doa => doaList.some(item => item.id === doa.id));
  }, [doaList, searchQuery]);

  const organizedDoa = useMemo(() => {
    if (tabType === "sehari-hari" && searchQuery.trim() === "") {
      return organizeDoaByTimeline(filteredDoa);
    }
    return null;
  }, [filteredDoa, tabType, searchQuery]);

  const renderGroupCard = (group: DoaGroup) => (
    <Link key={group.slug} href={`/doa/grup/${group.slug}`}>
      <Card className="mb-3 hover:shadow-md hover:bg-muted/50 transition-all cursor-pointer border-l-4 border-l-primary">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-base">{group.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {group.items.length} doa dalam satu grup
              </p>
              
              {/* Preview first doa */}
              <p 
                className="text-right text-sm text-muted-foreground font-arabic" 
                dir="rtl"
                style={{ fontFamily: "'Uthmanic Hafs', Arial" }}
              >
                {group.items[0]?.ar.split(' ').slice(0, 3).join(' ')}...
              </p>
            </div>
            
            <div className="flex items-center gap-2 ml-4">
              <Badge variant="outline" className="text-xs">
                {group.items.length} doa
              </Badge>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  const renderDoaCard = (doa: DoaItem) => {
    const slug = generateDoaSlug(doa);
    
    return (
      <Link key={doa.id} href={`/doa/${slug}`}>
        <Card className="mb-3 hover:shadow-md hover:bg-muted/50 transition-all cursor-pointer">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <h3 className="font-semibold text-base mb-1">{doa.nama}</h3>
                <p className="text-sm text-muted-foreground mb-2">{doa.grup}</p>
                
                {/* Preview of Arabic text (first few words) */}
                <p 
                  className="text-right text-sm text-muted-foreground" 
                  dir="rtl"
                  style={{ fontFamily: "'Uthmanic Hafs', Arial" }}
                >
                  {doa.ar.split(' ').slice(0, 4).join(' ')}...
                </p>
                
                {/* Tags */}
                {doa.tag && doa.tag.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {doa.tag.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {doa.tag.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{doa.tag.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <Heart className="h-4 w-4 text-gray-300 hover:text-red-500" />
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

  if (filteredDoa.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-2">
          {searchQuery ? <Search className="h-12 w-12 mx-auto mb-4" /> : <Heart className="h-12 w-12 mx-auto mb-4" />}
        </div>
        <p className="text-muted-foreground">
          {searchQuery 
            ? `Tidak ditemukan doa untuk "${searchQuery}"`
            : tabType === 'favorit'
            ? "Belum ada doa favorit. Klik ♡ pada doa untuk menambahkan ke favorit."
            : "Tidak ada doa tersedia"
          }
        </p>
      </div>
    );
  }

  // Render timeline organization for daily doa
  if (organizedDoa && tabType === "sehari-hari") {
    return (
      <div className="space-y-6">
        {Object.values(organizedDoa).map((section) => (
          (section.items.length > 0 || section.groups.length > 0) && (
            <div key={section.key} className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{section.icon}</span>
                <h2 className="text-xl font-semibold">{section.label}</h2>
                <Badge variant="outline">
                  {section.groups.length > 0 ? 
                    `${section.groups.length} grup, ${section.items.length} doa` :
                    `${section.items.length} doa`
                  }
                </Badge>
              </div>
              
              {/* Render groups first */}
              {section.groups.map(renderGroupCard)}
              
              {/* Then render individual doa */}
              {section.items.map(renderDoaCard)}
            </div>
          )
        ))}
      </div>
    );
  }

  // Render regular list
  return (
    <div className="space-y-4">
      {filteredDoa.map(renderDoaCard)}
    </div>
  );
};

export default DoaList;