"use client";
import { Input } from "@/components/ui/input";

export default function SearchBar({
  onSearch,
}: {
  onSearch: (term: string) => void;
}) {
  return (
    <div className="max-w-xl mx-auto">
      <Input
        type="search"
        placeholder="Search posts..."
        className="w-full"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}
