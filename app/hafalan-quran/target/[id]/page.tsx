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
      <main className="max-w-2xl mx-auto mb-8">
        <TargetHafalanDetail targetId={targetId} />
      </main>
      <Footer />
    </>
  );
}
