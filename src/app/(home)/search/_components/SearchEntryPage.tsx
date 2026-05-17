/** @format */

"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Search from "@/components/common/Field/Search";
import Typography from "@/components/common/Typography";
import type { OptionGroupProps } from "@/components/common/Option/OptionGroup";

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
        const response = await fetch(`/api/search/autocomplete?${params.toString()}`, {
          signal: controller.signal,
        });

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

  const optionGroupProps = useMemo<OptionGroupProps>(
    () => ({
      options: suggestions.map((suggestion) => ({
        label: suggestion,
        value: suggestion,
      })),
      onClickHandler: (value) => {
        if (typeof value === "string" && value.trim()) {
          router.push(toSearchPath(value.trim()));
        }
      },
      width: "full",
      className: "!w-full",
    }),
    [router, suggestions],
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  return (
    <>
      <section className="mobile:flex pc:hidden flex-col gap-6 pb-[113px]">
        <div className="pt-[13px]">
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
        </div>
        <Typography type="Body2Medium" className="text-gray-60">
          검색어를 입력해 관심 있는 활동을 찾아보세요.
        </Typography>
      </section>
      <section className="mobile:hidden pc:flex min-h-[320px] items-center justify-center">
        <Search
          status="default"
          wrapperClassName="w-[520px]"
          className="!w-full"
          placeholder="찾고 싶은 활동을 검색해보세요"
          autoFocus
          onChange={handleChange}
          optionGroupProps={optionGroupProps}
        />
      </section>
    </>
  );
}
