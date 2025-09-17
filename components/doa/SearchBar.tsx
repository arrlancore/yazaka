"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  value, 
  onChange, 
  placeholder = "Cari doa berdasarkan situasi..." 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  // Example search suggestions
  const searchExamples = [
    "mau tidur",
    "sebelum makan", 
    "perjalanan",
    "takut gelap",
    "sakit",
    "hujan"
  ];

  const handleClear = () => {
    onChange("");
  };

  const handleExampleClick = (example: string) => {
    onChange(example);
    setIsFocused(false); // Hide suggestions after selection
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="pl-10 pr-10 py-3 w-full text-base"
        />
        {value && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
            onClick={handleClear}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      
      {/* Search Examples */}
      {isFocused && !value && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-3 w-3" />
            <span>Contoh pencarian:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchExamples.map((example, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs h-7"
                onMouseDown={(e) => {
                  // Use onMouseDown instead of onClick to prevent onBlur from interfering
                  e.preventDefault();
                  handleExampleClick(example);
                }}
              >
                {example}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      {/* Search Results Count */}
      {value && value.length >= 3 && (
        <div className="text-xs text-muted-foreground">
          Pencarian: "{value}"
        </div>
      )}
    </div>
  );
};

export default SearchBar;