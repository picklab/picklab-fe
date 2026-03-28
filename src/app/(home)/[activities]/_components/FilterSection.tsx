/** @format */

"use client";

import Button from "@/components/common/Button/Button";
import SortTab from "@/components/common/Tab/SortTab";
import { ACTIVITY_FILTERS } from "../constants";
import { Dispatch, SetStateAction, useState } from "react";
import Typography from "@/components/common/Typography";
import Icon from "@/components/common/Icon/Icon";

interface FilterSectionProps {
  selectedFilters: Record<string, string[]>;
  setSelectedFilters: Dispatch<SetStateAction<Record<string, string[]>>>;
}

const FilterSection = ({ selectedFilters, setSelectedFilters }: FilterSectionProps) => {
  const [currentTab, setCurrentTab] = useState(ACTIVITY_FILTERS[0].title);

  const handleSelectFilter = (category: string, option: string) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev };
      if (!newFilters[category]) {
        newFilters[category] = [];
      }

      if (option === "전체") {
        newFilters[category] = ["전체"];
      } else {
        const filtered = newFilters[category].filter((item) => item !== "전체");
        if (filtered.includes(option)) {
          newFilters[category] = filtered.filter((item) => item !== option);
        } else {
          newFilters[category] = [...filtered, option];
        }
      }

      if (newFilters[category].length === 0) {
        newFilters[category] = ["전체"];
      }

      return newFilters;
    });
  };

  const currentOptions = ACTIVITY_FILTERS.find((filter) => filter.title === currentTab)?.options || [];

  const tabOptions = ACTIVITY_FILTERS.map((filter) => ({ label: filter.title, value: filter.title }));

  const selectedFilterEntries = Object.entries(selectedFilters).flatMap(([category, options]) =>
    options.map((option) => ({ category, option }))
  );

  return (
    <div className="flex flex-col gap-6">
      <SortTab options={tabOptions} onTabClick={(value) => setCurrentTab(value)} currentValue={currentTab} />
      <div className="flex flex-wrap gap-2.5">
        {currentOptions.map((option) => {
          const isSelected =
            selectedFilters[currentTab]?.includes(option) ?? (option === "전체" && !selectedFilters[currentTab]);
          return (
            <Button
              key={option}
              label={option}
              size={isSelected ? "sm" : "base"}
              buttonStyle={isSelected ? "filled" : "outlined"}
              isFullRounded={true}
              className="rounded-full"
              onClick={() => handleSelectFilter(currentTab, option)}
            />
          );
        })}
      </div>
      <div className="h-[1px] bg-gray-20" />
      {/* 한줄 넘어가면 다음줄로 갈 수 있게 처리 */}
      <div className="flex items-center gap-1 flex-wrap">
        <button
          className="flex items-center justify-center w-7 h-7 bg-primary-60 rounded-full"
          onClick={() => setSelectedFilters({})}
        >
          <Icon icon="largeRefresh" color="white" size={16} />
        </button>
        {selectedFilterEntries.map(({ category, option }) => (
          <div
            key={`${category}-${option}`}
            className="flex items-center bg-white px-3 py-1.5 border border-solid border-primary-60 rounded-full"
          >
            <Typography type="Body3Medium" className="text-primary-60">
              {option}
            </Typography>
            <button onClick={() => handleSelectFilter(category, option)}>
              <Icon icon="xMark" color="#009966" size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterSection;
