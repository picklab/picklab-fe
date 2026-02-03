/** @format */

"use client";
import { useState } from "react";
import NewActivityList from "../../_components/pc/NewActivityList";
import FilterSection from "./FilterSection";
import clsx from "clsx";

export default function PcActivites({
  activities,
  isStorybook = false,
}: {
  activities: string;
  isStorybook?: boolean;
}) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  return (
    <div className={clsx("w-[1058px] px-5 flex-col gap-10", isStorybook ? "flex" : "hidden pc:flex")}>
      <h1 className="text-3xl font-bold">{activities}</h1>
      <FilterSection selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} />
      <NewActivityList title={activities} />
    </div>
  );
}
