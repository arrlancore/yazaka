// components/home/HomePage.tsx
export function HomeTemplate() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 md:py-24 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                Buat Modul Pembelajaran Interaktif dengan Mudah
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Platform yang membantu guru menciptakan konten pembelajaran
                kreatif dan inovatif secara mandiri
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-primary-light text-primary-foreground font-semibold shadow-neon hover:scale-105 transition-transform">
                  Mulai Gratis
                </button>
                <button className="px-6 py-3 rounded-lg bg-card border border-border text-foreground font-semibold hover:shadow-neumorphic transition-shadow">
                  Pelajari Lebih Lanjut
                </button>
              </div>
            </div>
            <div className="flex-1">
              <img
                src="/hero-illustration.svg"
                alt="Interactive Learning"
                className="w-full max-w-lg mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            Fitur Unggulan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Generator Modul Otomatis",
                description:
                  "Buat modul pembelajaran dengan bantuan AI dalam hitungan menit",
                icon: "⚡",
              },
              {
                title: "Template Interaktif",
                description:
                  "Pilihan template pembelajaran yang menarik dan mudah disesuaikan",
                icon: "🎯",
              },
              {
                title: "Sistem Quiz",
                description:
                  "Buat dan kelola ujian online dengan mudah dan fleksibel",
                icon: "📝",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl bg-background border border-border hover:shadow-neumorphic transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            Cara Kerja
          </h2>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {[
              {
                step: "1",
                title: "Daftar",
                description: "Buat akun gratis untuk memulai",
              },
              {
                step: "2",
                title: "Buat Modul",
                description: "Pilih template atau gunakan generator otomatis",
              },
              {
                step: "3",
                title: "Bagikan",
                description:
                  "Berbagi dengan siswa melalui link atau kode kelas",
              },
            ].map((step, index) => (
              <div key={step.step} className="flex-1 text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-primary-light text-primary-foreground font-bold text-xl flex items-center justify-center mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-primary-light/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-6">
            Siap Memulai Perjalanan Mengajar yang Lebih Baik?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Bergabung dengan ribuan guru yang telah menggunakan Insperasi.com
            untuk membuat pembelajaran lebih interaktif
          </p>
          <button className="px-8 py-4 rounded-lg bg-gradient-to-r from-primary to-primary-light text-primary-foreground font-semibold text-lg shadow-neon hover:scale-105 transition-transform">
            Daftar Sekarang - Gratis!
          </button>
        </div>
      </section>
    </main>
  );
}
