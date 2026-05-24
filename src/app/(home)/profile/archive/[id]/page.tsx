import MobileArchiveDetailPage from './_components/MobileArchiveDetailPage';
import PcArchiveDetailPage from './_components/PcArchiveDetailPage';

export default async function ArchiveDetailPage({
  params,
}: {
  params?: Promise<{ id: string }> | { id: string };
}) {
  const { id } = params ? await Promise.resolve(params) : { id: 'storybook' };

  return (
    <>
      <MobileArchiveDetailPage archiveId={id} />
      <PcArchiveDetailPage archiveId={id} />
    </>
  );
}
