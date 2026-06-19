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
  selectedButtonSize?: "base" | "sm";
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
      <SortTab options={tabOptions} onTabClick={(value) => setCurrentTab(value)} currentValue={currentTab} variant="filter" />
      <div className="flex flex-wrap gap-2.5">
        {currentOptions.map((option) => {
          const isSelected =
            selectedFilters[currentTab]?.includes(option) ?? (option === "전체" && !selectedFilters[currentTab]);
          return (
            <Button
              key={option}
              label={option}
              size="base"
              buttonStyle={isSelected ? "filled" : "outlined"}
              isFullRounded={true}
              className={`rounded-full !min-w-[72px] ${
                isSelected
                  ? ""
                  : "!border-0 !bg-gray-10 hover:!bg-gray-20 [&_span]:!text-[15px] [&_span]:!font-medium [&_span]:!text-gray-50"
              }`}
              onClick={() => handleSelectFilter(currentTab, option)}
            />
          );
        })}
      </div>
      <div className="h-[1px] bg-gray-20" />
      {/* 한줄 넘어가면 다음줄로 갈 수 있게 처리 */}
      <div className="flex items-center gap-1 flex-wrap">
        {/* 디자인: 선택 칩 → 새로고침(초기화) 순 */}
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
        <button
          className="flex items-center justify-center w-7 h-7 bg-primary-50 rounded-full"
          onClick={() => setSelectedFilters({})}
        >
          <Icon icon="largeRefresh" color="white" size={16} />
        </button>
      </div>
    </div>
  );
};

export default FilterSection;
