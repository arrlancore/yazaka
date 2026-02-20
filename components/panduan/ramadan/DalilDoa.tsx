import { getDoaByGrup } from "@/data/panduan/ramadan-doa";
import DoaCard from "@/components/doa/DoaCard";

export default function DalilDoa() {
  const doaByGrup = getDoaByGrup();
  const grupOrder = [
    "Niat",
    "Berbuka",
    "Lailatul Qadar",
    "Makan & Minum",
    "Witir & Tarawih",
    "Dzikir Pagi & Petang",
    "Doa Khusus Ramadan",
  ];

  return (
    <div className="space-y-4">
      <div className="px-4 py-3">
        <p className="text-xs text-muted-foreground italic">
          Doa-doa berikut telah diverifikasi keshahihannya. Perhatikan
          keterangan hadits pada masing-masing doa.
        </p>
      </div>

      {grupOrder.map((grup) => {
        const items = doaByGrup[grup];
        if (!items?.length) return null;
        return (
          <div key={grup}>
            <h3 className="px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
              {grup}
            </h3>
            {items.map((doa, i) => (
              <DoaCard key={doa.slug} index={i + 1} doa={doa} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
