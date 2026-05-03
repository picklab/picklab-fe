/** @format */

"use client";
import { useMemo, useState } from "react";
import NewActivityList from "../../_components/pc/NewActivityList";
import FilterSection from "./FilterSection";
import clsx from "clsx";
import Typography from "@/components/common/Typography";
import Link from "next/link";
import Footer from "@/components/common/Footer/Footer";
import {
  getActivityCountForCategoryPage,
  type ActivityPageFilters,
  type ActivityRouteSlug,
} from "@/lib/activity-data";

export default function PcActivites({
  activities,
  activitySlug,
  isStorybook = false,
}: {
  activities: string;
  activitySlug: ActivityRouteSlug;
  isStorybook?: boolean;
}) {
  const [selectedFilters, setSelectedFilters] = useState<ActivityPageFilters>(
    {},
  );
  const count = useMemo(
    () =>
      getActivityCountForCategoryPage({ slug: activitySlug, selectedFilters }),
    [activitySlug, selectedFilters],
  );

  return (
    <>
      <div
        className={clsx(
          "w-full px-5 flex-col gap-10",
          isStorybook ? "flex" : "hidden pc:flex",
        )}
      >
        <Typography
          type="Heading2Medium"
          className="text-gray-90 max-w-[1100px] mx-auto"
        >
          {activities}
        </Typography>
        <div className="max-w-[1100px] mx-auto w-full">
          <FilterSection
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
          />
          <Typography type="Body2Medium" className="text-gray-50 mt-10">
            공고 {count}건
          </Typography>
          <NewActivityList
            title={activities}
            categorySlug={activitySlug}
            selectedFilters={selectedFilters}
            showInlineFilters={false}
          />
        </div>
      </div>
    </>
  );
}
