/** @format */

"use client";
import { useState } from "react";
import NewActivityList from "../../_components/pc/NewActivityList";
import FilterSection from "./FilterSection";
import clsx from "clsx";
import Typography from "@/components/common/Typography";
import Link from "next/link";

export default function PcActivites({
  activities,
  isStorybook = false,
}: {
  activities: string;
  isStorybook?: boolean;
}) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const count = 10; // TODO: replace with actual count from API

  return (
    <div className={clsx("w-[1058px] px-5 flex-col gap-10", isStorybook ? "flex" : "hidden pc:flex")}>
      <nav className="flex items-center gap-1 text-sm">
        <Link href="/" className="text-gray-50 hover:text-gray-70">
          <Typography type="Caption1Medium" className="text-gray-50">홈</Typography>
        </Link>
        <Typography type="Caption1Medium" className="text-gray-40">&gt;</Typography>
        <Typography type="Caption1Medium" className="text-gray-90">{activities}</Typography>
      </nav>
      <FilterSection selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} />
      <Typography type="Body2Medium" className="text-gray-60">공고 {count}건</Typography>
      <NewActivityList title={activities} />
    </div>
  );
}
