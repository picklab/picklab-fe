import PcSearchPage from '../_components/PcSearchPage';
import MobileSearchPage from '../_components/MobileSearchPage';

export default function SearchPage({ params }: { params: { search: string } }) {
  const { search } = params;
  return (
    <>
      <PcSearchPage search={search} />
      <MobileSearchPage search={search} />
    </>
  );
}
