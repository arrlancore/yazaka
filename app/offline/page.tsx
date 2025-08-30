import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WifiOff } from "lucide-react";
import Link from "next/link";
import { RefreshButton } from "@/components/pwa/RefreshButton";

export default function OfflinePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="p-8">
          <div className="mb-6">
            <WifiOff className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Tidak Ada Koneksi</h1>
            <p className="text-muted-foreground">
              Anda sedang offline. Beberapa konten mungkin tidak tersedia.
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Konten yang tersedia offline:
            </p>
            
            <div className="space-y-2">
              <Link href="/quran" className="block">
                <Button variant="outline" className="w-full">
                  Al-Qur'an (Tersimpan)
                </Button>
              </Link>
              
              <Link href="/jadwal-shalat" className="block">
                <Button variant="outline" className="w-full">
                  Jadwal Shalat
                </Button>
              </Link>
              
              <Link href="/hafalan-quran" className="block">
                <Button variant="outline" className="w-full">
                  Hafalan Quran
                </Button>
              </Link>
            </div>

            <div className="pt-4 border-t">
              <RefreshButton />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 text-center">
        <Link href="/" className="text-primary hover:underline">
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}