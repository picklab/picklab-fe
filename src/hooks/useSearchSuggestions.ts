'use client';

import { useEffect, useState } from 'react';

type AutocompleteResponse = {
  data?: {
    suggestions?: string[];
  };
};

/** 검색어 자동완성 (GET /api/search/autocomplete). 2글자 이상부터 250ms 디바운스로 요청 */
export function useSearchSuggestions(keyword: string, limit = 10) {
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
        const params = new URLSearchParams({ keyword: trimmedKeyword, limit: String(limit) });
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
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          setSuggestions([]);
        }
      }
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [keyword, limit]);

  return suggestions;
}
