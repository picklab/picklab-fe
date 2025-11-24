'use client';
import { useState } from 'react';
import NewActivityList from '../../_components/pc/NewActivityList';
import FilterSection from './FilterSection';

export default function PcActivites() {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  return (
    <div className="hidden pc:flex w-[1058px] px-5  flex-col gap-10">
      <h1 className="text-3xl font-bold">대외활동</h1>
      <FilterSection selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} />
      <NewActivityList title="대외활동" />
    </div>
  );
}
