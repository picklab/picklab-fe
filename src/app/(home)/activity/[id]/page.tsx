import { notFound } from 'next/navigation';
import PcActivityDetailPage from './_components/PcActivityDetailPage';
import MobileActivityDetailPage from './_components/MobileActivityDetailPage';
import { findActivityById, mapActivityToDetailItem } from '@/lib/activity-data';

interface ActivityDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ActivityDetailPage({ params }: ActivityDetailPageProps) {
  const { id } = await params;
  const rawActivity = findActivityById(id);

  if (!rawActivity) {
    return notFound();
  }

  const activity = mapActivityToDetailItem(rawActivity);

  return (
    <>
      <PcActivityDetailPage activity={activity} />
      <MobileActivityDetailPage activity={activity} />
    </>
  );
}
