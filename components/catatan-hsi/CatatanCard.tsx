import Link from "next/link";
import { CatatanData } from "@/lib/catatan-hsi/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

interface CatatanCardProps {
  catatan: CatatanData;
}

export function CatatanCard({ catatan }: CatatanCardProps) {
  const { metadata, slug } = catatan;
  
  return (
    <Link href={`/catatan-hsi/${slug}`}>
      <Card className="group hover:shadow-lg transition-all duration-200 border-gray-200 hover:border-emerald-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg group-hover:text-emerald-600 transition-colors line-clamp-2">
              {metadata.title}
            </CardTitle>
            <Badge variant="secondary" className="shrink-0 text-xs">
              {metadata.series}
            </Badge>
          </div>
          <CardDescription className="line-clamp-2">
            {metadata.summary}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>{metadata.ustad}</span>
            </div>
            
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span>Episode {metadata.episode}/{metadata.totalEpisodes}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {metadata.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {metadata.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{metadata.tags.length - 3} more
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}