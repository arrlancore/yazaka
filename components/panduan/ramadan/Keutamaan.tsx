import { keutamaanItems } from "@/data/panduan/ramadan-keutamaan";
import KeutamaanCard from "./KeutamaanCard";

export default function Keutamaan() {
  return (
    <div className="px-4 space-y-6 py-2">
      <div className="space-y-6">
        {keutamaanItems.map((item) => (
          <KeutamaanCard key={item.id} item={item} />
        ))}
      </div>

      <div className="pt-4 pb-2">
        <p className="text-xs text-muted-foreground text-center italic">
          Semoga Allah menerima amalan kita dan menjadikan Ramadan ini lebih
          baik dari sebelumnya.
          <br />
          <span className="not-italic font-arabic text-base">
            آمِيْن يَا رَبَّ الْعَالَمِيْنَ
          </span>
        </p>
      </div>
    </div>
  );
}
