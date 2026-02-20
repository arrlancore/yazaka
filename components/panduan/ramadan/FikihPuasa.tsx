import { fikihSections } from "@/data/panduan/ramadan-fikih";
import FikihSection from "./FikihSection";

export default function FikihPuasa() {
  return (
    <div className="space-y-0.5">
      <div className="px-4 py-3">
        <p className="text-xs text-muted-foreground italic leading-relaxed">
          &quot;Barangsiapa yang beribadah kepada Allah tanpa ilmu, maka dia akan
          membuat lebih banyak kerusakan daripada mendatangkan kebaikan.&quot;
          <br />— Umar bin Abdul Aziz
        </p>
      </div>

      <div className="space-y-0.5">
        {fikihSections.map((section) => (
          <FikihSection key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
}
