import { notFound } from 'next/navigation';
import { getCatatanBySlug, getAllCatatanSlugs } from '@/lib/catatan-hsi/content';
import { CatatanPage } from '@/components/catatan-hsi/CatatanPage';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const slugs = getAllCatatanSlugs();
  
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const catatan = getCatatanBySlug(params.slug);
  
  if (!catatan) {
    return {
      title: 'Catatan not found',
    };
  }

  return {
    title: `${catatan.metadata.title} - Catatan HSI`,
    description: catatan.metadata.summary,
    keywords: catatan.metadata.tags.join(', '),
  };
}

export default function CatatanDetailPage({ params }: PageProps) {
  const catatan = getCatatanBySlug(params.slug);

  if (!catatan) {
    notFound();
  }

  return <CatatanPage catatan={catatan} />;
}