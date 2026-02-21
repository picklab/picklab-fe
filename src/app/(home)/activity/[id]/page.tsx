import { notFound } from 'next/navigation';
import { CardData } from '../../_components/constant';
import PcActivityDetailPage from './_components/PcActivityDetailPage';
import MobileActivityDetailPage from './_components/MobileActivityDetailPage';

interface ActivityDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ActivityDetailPage({ params }: ActivityDetailPageProps) {
  const { id } = await params;
  const activity = CardData.find((item) => item.detailLink.split('/').pop() === id);

  if (!activity) {
    notFound();
  }

  return (
    <>
      <PcActivityDetailPage activity={activity} />
      <MobileActivityDetailPage activity={activity} />
    </>
  );
}
