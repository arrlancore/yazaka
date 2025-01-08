import Footer from "@/components/footer";
import Header from "@/components/header";
import TargetHafalanDetail from "@/components/TargetHafalanDetail";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function TargetDetailPage({ params }: PageProps) {
  const targetId = params.id;

  return (
    <>
      <Header />
      <main className="sm:container flex flex-col sm:gap-4 py-4">
        <TargetHafalanDetail targetId={targetId} />
      </main>
      <Footer />
    </>
  );
}
