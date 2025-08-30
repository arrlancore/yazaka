"use client";

import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Heart, Star, Search, ChevronRight, BookOpen, Users } from "lucide-react";
import { DoaItem, DoaTabType, DoaGroup } from "@/types/doa";
import { searchDoa, generateDoaSlug, generateGroupSlug, getDoaById, getDoaByGroup } from "@/services/doaServices";
import Link from "next/link";

interface DoaListProps {
  doaList: DoaItem[];
  searchQuery: string;
  tabType: DoaTabType;
}

const DoaList: React.FC<DoaListProps> = ({ doaList, searchQuery, tabType }) => {
  // Mapping config for 'sehari-hari' tab
  const sehariHariMapping = useMemo(() => ([
    {
      category: "**DZIKIR PAGI DAN PETANG**",
      list: [
        "Dzikir Pagi",
        "Dzikir Petang"
      ]
    },
    {
      category: "**DOA PAGI HARI**",
      list: [
        6,
        11,
        128,
        48
      ]
    },
    {
      category: "**DOA BERKAITAN DENGAN MASJID**",
      list: [
        276,
        277,
        134
      ]
    },
    {
      category: "**DOA BERKAITAN DENGAN TOILET**",
      list: [
        8,
        9
      ]
    },
    {
      category: "**DOA BERKAITAN DENGAN MAKAN**",
      list: [
        135,
        139
      ]
    },
    {
      category: "**DOA KETIKA BERSIN**",
      list: [
        189
      ]
    },
    {
      category: "**DOA MALAM HARI**",
      list: [
        2,
        278
      ]
    },
    {
      category: "**DOA-DOA KHUSUS**",
      list: [
        36,
        250,
        279,
        227,
        95,
        13
      ]
    }
  ]), []);

  // Normalize section title for display
  const displayTitle = (raw: string) => {
    const plain = raw.replace(/\*/g, '').trim().toLowerCase();
    return plain.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const filteredDoa = useMemo(() => {
    if (searchQuery.trim() === "") {
      return doaList;
    }
    const searchResults = searchDoa(searchQuery);
    // Extract doa items from search results and filter by current tab
    const searchedDoaItems = searchResults.map(result => result.item);
    return searchedDoaItems.filter(doa => doaList.some(item => item.id === doa.id));
  }, [doaList, searchQuery]);

  // Build UI data from mapping for 'sehari-hari' tab when no search
  const mappedSections = useMemo(() => {
    if (tabType !== "sehari-hari" || searchQuery.trim() !== "") return null;

    return sehariHariMapping.map(section => {
      const items = section.list.map((entry: string | number) => {
        if (typeof entry === 'string') {
          const groupItems = getDoaByGroup(entry);
          return {
            type: 'group' as const,
            name: entry,
            count: groupItems.length,
            slug: generateGroupSlug(entry)
          };
        } else {
          const doa = getDoaById(entry);
          if (!doa) return null;
          return {
            type: 'doa' as const,
            data: doa,
            slug: generateDoaSlug(doa)
          };
        }
      }).filter(Boolean) as Array<
        | { type: 'group'; name: string; count: number; slug: string }
        | { type: 'doa'; data: DoaItem; slug: string }
      >;

      return {
        title: section.category,
        items
      };
    });
  }, [tabType, searchQuery, sehariHariMapping]);

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
                style={{ fontFamily: "var(--font-scheherazade), var(--font-noto-naskh), 'Uthmanic Hafs', serif" }}
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
                  style={{ fontFamily: "var(--font-scheherazade), var(--font-noto-naskh), 'Uthmanic Hafs', serif" }}
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

  // Render mapping-based list for daily doa
  if (mappedSections && tabType === "sehari-hari") {
    return (
      <div className="space-y-8">
        {mappedSections.map((section, idx) => (
          <div key={idx}>
            <h2 className="text-lg font-semibold mb-3">{displayTitle(section.title)}</h2>
            <ul className="list-disc pl-6 space-y-1">
              {section.items.map((item) => {
                if (item.type === 'group') {
                  return (
                    <li key={`g-${item.slug}`}>
                      <Link href={`/doa/grup/${item.slug}`} className="hover:underline">
                        {item.name} ({item.count})
                      </Link>
                    </li>
                  );
                }
                return (
                  <li key={`d-${item.data.id}`}>
                    <Link href={`/doa/${item.slug}`} className="hover:underline">
                      {item.data.nama}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
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