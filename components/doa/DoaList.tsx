"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  MapPin,
  Heart,
  Star,
  Search,
  ChevronRight,
  BookOpen,
  Users,
} from "lucide-react";
import { DoaItem, DoaTabType, DoaGroup } from "@/types/doa";
import {
  isFavorite,
  toggleFavorite,
  generateDoaSlug,
  generateGroupSlug,
} from "@/lib/doa-client-utils";
import { sehariHariMapping } from "@/lib/doa-mapping";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface DoaListProps {
  doaList: DoaItem[];
  searchQuery: string;
  tabType: DoaTabType;
  favoriteGroups?: DoaGroup[];
}

const DoaList: React.FC<DoaListProps> = ({
  doaList,
  searchQuery,
  tabType,
  favoriteGroups = [],
}) => {

  // Normalize section title for display
  const displayTitle = (raw: string) => {
    const plain = raw.replace(/\*/g, "").trim().toLowerCase();
    return plain
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const filteredDoa = useMemo(() => {
    if (searchQuery.trim() === "") {
      return doaList;
    }

    // Simple client-side search filtering
    const lowerQuery = searchQuery.toLowerCase();
    return doaList.filter((doa) => {
      const searchableText = [
        doa.nama,
        doa.idn,
        doa.grup,
        doa.ar,
        doa.tr,
        ...(doa.tag || []),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(lowerQuery);
    });
  }, [doaList, searchQuery]);

  // Pagination state (25 per page)
  const pageSize = 25;
  const [page, setPage] = useState(1);

  // Reset to first page when list context changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery, tabType]);

  const totalPages = Math.max(1, Math.ceil(filteredDoa.length / pageSize));
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pagedDoa = filteredDoa.slice(startIndex, endIndex);

  // Build UI data from mapping for 'sehari-hari' tab when no search
  const mappedSections = useMemo(() => {
    if (tabType !== "sehari-hari" || searchQuery.trim() !== "") return null;

    return sehariHariMapping.map((section) => {
      const items = section.list
        .map((entry: string) => {
          // Check if it's a group name (starts with capital and contains spaces)
          if (entry.includes(" ") && entry[0] === entry[0].toUpperCase()) {
            // Filter doa by group name from existing doaList
            const groupItems = doaList.filter((doa) => doa.grup === entry);
            return {
              type: "group" as const,
              name: entry,
              count: groupItems.length,
              slug: generateGroupSlug(entry),
            };
          } else {
            // It's a doa slug - find the doa by slug
            const doa = doaList.find((d) => d.slug === entry);
            if (doa) {
              return {
                type: "doa" as const,
                data: doa,
                slug: doa.slug,
              };
            }
            if (entry === "doa-masuk-masjid") {
              console.log(
                "All available slugs:",
                doaList.map((d) => d.slug).sort()
              );
            }
            console.warn(`Doa not found for slug: ${entry}`, {
              entry,
              totalAvailable: doaList.length,
              sampleSlugs: doaList.map((d) => d.slug).slice(0, 10),
            });
            return null;
          }
        })
        .filter(Boolean) as Array<
        | { type: "group"; name: string; count: number; slug: string }
        | { type: "doa"; data: DoaItem; slug: string }
      >;

      return {
        title: section.category,
        items,
      };
    });
  }, [tabType, searchQuery, sehariHariMapping]);

  // Listen to favorites change to refresh hearts in list
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    const handler = () => forceUpdate((v) => v + 1);
    if (typeof window !== "undefined") {
      window.addEventListener("doa-favorites-changed" as any, handler);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("doa-favorites-changed" as any, handler);
      }
    };
  }, []);

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
                style={{
                  fontFamily:
                    "var(--font-scheherazade), var(--font-noto-naskh), 'Uthmanic Hafs', serif",
                }}
              >
                {group.items[0]?.ar.split(" ").slice(0, 3).join(" ")}...
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
      <Link key={doa.slug} href={`/doa/${slug}`}>
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
                  style={{
                    fontFamily:
                      "var(--font-scheherazade), var(--font-noto-naskh), 'Uthmanic Hafs', serif",
                  }}
                >
                  {doa.ar.split(" ").slice(0, 4).join(" ")}...
                </p>

                {/* Tags */}
                {doa.tag && doa.tag.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {doa.tag.slice(0, 3).map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  aria-label={
                    isFavorite(doa.slug)
                      ? "Hapus dari favorit"
                      : "Tambah ke favorit"
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(doa.slug);
                    // forceUpdate will run via event listener, but also trigger now
                    forceUpdate((v) => v + 1);
                  }}
                >
                  <Heart
                    className={`h-4 w-4 ${isFavorite(doa.slug) ? "text-red-500 fill-red-500" : ""}`}
                  />
                </Button>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

  if (
    filteredDoa.length === 0 &&
    !(tabType === "favorit" && favoriteGroups.length > 0)
  ) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-2">
          {searchQuery ? (
            <Search className="h-12 w-12 mx-auto mb-4" />
          ) : (
            <Heart className="h-12 w-12 mx-auto mb-4" />
          )}
        </div>
        <p className="text-muted-foreground">
          {searchQuery
            ? `Tidak ditemukan doa untuk "${searchQuery}"`
            : tabType === "favorit"
              ? "Belum ada doa favorit. Klik ♡ pada doa untuk menambahkan ke favorit."
              : "Tidak ada doa tersedia"}
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
            <h2 className="font-semibold mb-4">
              {displayTitle(section.title)}
            </h2>
            <ul className="space-y-2">
              {section.items.map((item) => {
                if (item.type === "group") {
                  return (
                    <li key={`g-${item.slug}`} className="group">
                      <Link
                        href={`/doa/grup/${item.slug}`}
                        className="flex items-center py-2 px-1 hover:bg-blue-50/70 rounded-md transition-all duration-200"
                      >
                        <div className="flex items-center space-x-3 w-full">
                          <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:scale-125 transition-transform"></div>
                          <span className="text-sm group-hover:text-blue-700 transition-colors">
                            {item.name}
                          </span>
                          <span className="ml-auto text-xs font-medium text-slate-500 group-hover:text-blue-600 transition-colors">
                            {item.count}
                          </span>
                        </div>
                      </Link>
                    </li>
                  );
                }
                return (
                  <li key={`d-${item.data.slug}`} className="group">
                    <Link
                      href={`/doa/${item.slug}`}
                      className="flex items-center py-2 px-1 hover:bg-emerald-50/70 rounded-md transition-all duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 group-hover:scale-125 transition-transform"></div>
                        <span className="text-sm group-hover:text-emerald-700 transition-colors">
                          {item.data.nama}
                        </span>
                      </div>
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

  // Render regular list with optional favorite groups on Favorit tab
  return (
    <div className="space-y-4">
      {tabType === "favorit" && favoriteGroups.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-base font-semibold">Grup Favorit</h3>
          {favoriteGroups.map((g) => renderGroupCard(g))}
        </div>
      )}

      {pagedDoa.map(renderDoaCard)}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <button
            className="text-sm px-3 py-1 rounded border hover:bg-muted disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Sebelumnya
          </button>
          <div className="text-sm text-muted-foreground">
            Halaman {page} dari {totalPages}
          </div>
          <button
            className="text-sm px-3 py-1 rounded border hover:bg-muted disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Berikutnya
          </button>
        </div>
      )}
    </div>
  );
};

export default DoaList;
