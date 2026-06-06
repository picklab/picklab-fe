/** @format */

"use client";
import { useState } from "react";
import Link from "next/link";
import NewActivityList from "../../_components/pc/NewActivityList";
import FilterSection from "./FilterSection";
import clsx from "clsx";
import Typography from "@/components/common/Typography";
import {
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

  return (
    <div
      className={clsx(
        "w-full px-5 pb-20 flex-col gap-10",
        isStorybook ? "flex" : "hidden pc:flex",
      )}
    >
      <div className="max-w-[1100px] mx-auto w-full flex flex-col gap-3">
        {/* 브레드크럼: 홈 > {카테고리} */}
        <div className="flex items-center gap-1 text-gray-50">
          <Link href="/" className="hover:text-gray-70">
            <Typography type="Body4Medium">홈</Typography>
          </Link>
          <Typography type="Body4Medium">&gt;</Typography>
          <Typography type="Body4Medium">{activities}</Typography>
        </div>
        <Typography type="Title2Bold" className="text-gray-90">
          {activities}
        </Typography>
      </div>
      <div className="max-w-[1100px] mx-auto w-full">
        <FilterSection
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
        />
        <div className="mt-10">
          <NewActivityList
            title={activities}
            categorySlug={activitySlug}
            selectedFilters={selectedFilters}
            showInlineFilters={false}
            showTitle={false}
          />
        </div>
      </div>
    </div>
  );
}
