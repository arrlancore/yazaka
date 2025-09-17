"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Heart,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import { DoaItem } from "@/types/doa";
import {
  isFavorite,
  toggleFavorite,
  generateDoaSlug,
} from "@/lib/doa-client-utils";
import { DoaSearchEngine } from "@/lib/doa-search-engine";
import Link from "next/link";

interface SearchResultsProps {
  doaList: DoaItem[];
  searchQuery: string;
  onClearSearch: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  doaList,
  searchQuery,
  onClearSearch,
}) => {
  const [searchEngine, setSearchEngine] = useState<DoaSearchEngine | null>(null);

  // Initialize search engine
  useEffect(() => {
    if (doaList.length > 0 && !searchEngine) {
      const engine = new DoaSearchEngine(doaList);
      setSearchEngine(engine);
    }
  }, [doaList, searchEngine]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || !searchEngine) {
      return [];
    }

    try {
      const results = searchEngine.search(searchQuery);
      return results.map(r => r.item);
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to simple search
      const lowerQuery = searchQuery.toLowerCase();
      return doaList.filter((doa) => {
        const searchableText = [
          doa.nama,
          doa.idn,
          doa.grup,
          ...(doa.tag || []),
        ].join(" ").toLowerCase();
        return searchableText.includes(lowerQuery);
      });
    }
  }, [doaList, searchQuery, searchEngine]);

  // Pagination state (25 per page)
  const pageSize = 25;
  const [page, setPage] = useState(1);

  // Reset to first page when search changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const totalPages = Math.max(1, Math.ceil(searchResults.length / pageSize));
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pagedResults = searchResults.slice(startIndex, endIndex);

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

  const renderDoaCard = (doa: DoaItem) => {
    const slug = generateDoaSlug(doa);
    const linkUrl = searchQuery 
      ? `/doa/${slug}?back_q=${encodeURIComponent(searchQuery)}`
      : `/doa/${slug}`;

    return (
      <Link key={doa.slug} href={linkUrl}>
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

  if (searchResults.length === 0) {
    return (
      <div className="space-y-4">
        {/* Search header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Hasil pencarian untuk "{searchQuery}"
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault();
              onClearSearch();
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3 mr-1" />
            Hapus
          </Button>
        </div>

        {/* No results */}
        <div className="text-center py-8">
          <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-muted-foreground">
            Tidak ditemukan doa untuk "{searchQuery}"
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Coba gunakan kata kunci yang berbeda
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search header with results count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {searchResults.length} hasil untuk "{searchQuery}"
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            onClearSearch();
          }}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-3 w-3 mr-1" />
          Hapus
        </Button>
      </div>

      {/* Search results */}
      <div className="space-y-3">
        {pagedResults.map(renderDoaCard)}
      </div>

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

export default SearchResults;