import { brand } from "@/config";

export function BlogFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} {brand.title}
        {brand.domain ? "." + brand.domain : ""} All rights reserved.
      </div>
    </footer>
  );
}
