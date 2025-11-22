import PcSearchPage from '../_components/PcSearchPage';
import MobileSearchPage from '../_components/MobileSearchPage';

export default async function SearchPage({ params }: { params: Promise<{ search: string }> }) {
  const { search } = await params;
  return (
    <>
      <PcSearchPage search={search} />
      <MobileSearchPage search={search} />
    </>
  );
}
