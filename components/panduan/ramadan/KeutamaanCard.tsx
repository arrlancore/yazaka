import { KeutamaanItem } from "@/types/panduan";
import { cn } from "@/lib/utils";

interface KeutamaanCardProps {
  item: KeutamaanItem;
}

const borderColors = {
  hadith: "border-l-emerald-500",
  "salaf-quote": "border-l-amber-500",
  "salaf-example": "border-l-indigo-500",
};

const typeLabels = {
  hadith: "Hadits / Al-Qur'an",
  "salaf-quote": "Perkataan Salaf",
  "salaf-example": "Kisah Salaf",
};

export default function KeutamaanCard({ item }: KeutamaanCardProps) {
  return (
    <div
      className={cn(
        "border-l-4 pl-4 py-3 pr-3",
        borderColors[item.type]
      )}
    >
      {item.subject && (
        <p className="text-xs font-semibold text-muted-foreground mb-1">
          {item.subject}
        </p>
      )}

      {item.arabic && (
        <p
          className="text-right text-foreground/80 mb-3 leading-loose"
          style={{
            fontSize: "24px",
            fontFamily:
              "var(--font-scheherazade), var(--font-noto-naskh), 'Uthmanic Hafs', serif",
            lineHeight: 2,
            direction: "rtl",
          }}
        >
          {item.arabic}
        </p>
      )}

      <p className="text-sm leading-relaxed text-foreground/90">
        {item.translation}
      </p>

      <p className="text-xs text-muted-foreground mt-2 font-medium">
        — {item.source}
      </p>

      {item.commentary && (
        <p className="text-xs text-muted-foreground/80 mt-2 leading-relaxed italic border-t border-border pt-2">
          {item.commentary}
        </p>
      )}

      <span className="inline-block mt-2 text-xs text-muted-foreground/60 bg-muted rounded-full px-2 py-0.5">
        {typeLabels[item.type]}
      </span>
    </div>
  );
}
