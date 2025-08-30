import TargetHafalanDetail from "@/components/TargetHafalanDetail";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function TargetDetailPage({ params }: PageProps) {
  const targetId = params.id;

  return (
    <main className="max-w-2xl mx-auto mb-8 px-4 md:px-0">
      <TargetHafalanDetail targetId={targetId} />
    </main>
  );
}
