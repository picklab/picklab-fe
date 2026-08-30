/** @format */

"use client";

import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Search from "@/components/common/Field/Search";
import type { OptionGroupProps } from "@/components/common/Option/OptionGroup";
import { createSearchHistory } from "@/hooks/useSearchHistory";
import RecentSearchHistory from "./RecentSearchHistory";
import PopularSearchKeywords from "./PopularSearchKeywords";

type AutocompleteResponse = {
  data?: {
    suggestions?: string[];
  };
};

function toSearchPath(keyword: string) {
  return `/search/${encodeURIComponent(keyword)}?tab=all`;
}

export default function SearchEntryPage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const trimmedKeyword = keyword.trim();

    if (trimmedKeyword.length < 2) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          keyword: trimmedKeyword,
          limit: "10",
        });
        const response = await fetch(
          `/api/search/autocomplete?${params.toString()}`,
          {
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          setSuggestions([]);
          return;
        }

        const payload = (await response.json()) as AutocompleteResponse;
        setSuggestions(payload.data?.suggestions ?? []);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setSuggestions([]);
        }
      }
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [keyword]);

  // 검색 실행 시 기록 저장(fire-and-forget) 후 검색 결과로 이동
  const goSearch = useCallback(
    (keyword: string) => {
      const trimmed = keyword.trim();
      if (!trimmed) return;
      createSearchHistory(trimmed);
      router.push(toSearchPath(trimmed));
    },
    [router],
  );

  const optionGroupProps = useMemo<OptionGroupProps>(
    () => ({
      options: suggestions.map((suggestion) => ({
        label: suggestion,
        value: suggestion,
      })),
      onClickHandler: (value) => {
        if (typeof value === "string") {
          goSearch(value);
        }
      },
      type: "iconWithText",
      icon: "search",
      query: keyword.trim(),
      width: "full",
      className: "!w-full !rounded-2xl",
      itemClassName: "min-h-[56px]",
    }),
    [goSearch, suggestions, keyword],
  );

  const showHistory = keyword.trim() === "";

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  return (
    <>
      <section className="mobile:flex pc:hidden flex-col pb-[113px]">
        <Search
          status="default"
          wrapperClassName="w-full"
          className="!w-full !rounded-[6px] !border-[#00BC7D] hover:!border-[#00BC7D] active:!border-[#00BC7D] focus:!border-[#00BC7D]"
          iconClassName="!text-[#00BC7D]"
          placeholder="찾고 싶은 활동을 검색해보세요"
          autoFocus
          onChange={handleChange}
          optionGroupProps={optionGroupProps}
        />

        {showHistory && (
          <div className="mt-[31.8px] flex flex-col gap-6">
            <RecentSearchHistory
              onSelect={goSearch}
              alwaysShowHeader
              className="w-full"
            />
            <div className="h-px w-full bg-gray-20" />
            <PopularSearchKeywords />
          </div>
        )}
      </section>
      <section className="mobile:hidden pc:flex min-h-[320px] flex-col items-center justify-center gap-6">
        <Search
          status="default"
          wrapperClassName="w-[520px]"
          className="!w-full"
          placeholder="찾고 싶은 활동을 검색해보세요"
          autoFocus
          onChange={handleChange}
          optionGroupProps={optionGroupProps}
        />
        {showHistory && <RecentSearchHistory onSelect={goSearch} />}
        {/* TODO(인기검색어): 백엔드 랭킹+순위변동 API 필요 — 미구현 */}
      </section>
    </>
  );
}
