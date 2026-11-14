'use client';

import { useRef } from 'react';

/**
 * React Query 결과를 화면에 써도 되는지 판단한다(기존 수제 fetch 훅과 같은 동작을 위해).
 * - 이 컴포넌트가 마운트된 뒤 받은 응답이면 쓴다. 화면 이동 직후 다른 화면이 남긴 캐시는 쓰지 않는다.
 * - 파라미터가 바뀌어 다시 불러오는 동안(keepPreviousData)에는, 이 컴포넌트가 직전에 받은 결과를 계속 보여 준다.
 *   (isFetchedAfterMount는 키가 바뀌면 새 쿼리 기준으로 false가 되므로 따로 기억해 둔다)
 */
export function useReadyAfterMount(query: { isFetchedAfterMount: boolean; isPlaceholderData: boolean }): boolean {
  const fetchedOnce = useRef(false);
  if (query.isFetchedAfterMount) fetchedOnce.current = true;
  return query.isFetchedAfterMount || (query.isPlaceholderData && fetchedOnce.current);
}
