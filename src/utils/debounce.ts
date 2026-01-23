/**
 * 디바운스 함수
 * - 특정 시간(delay) 동안 이벤트가 반복되면 마지막 이벤트만 실행
 * function searchQuery(query) {
    console.log(Searching for: ${query});
    }
    // 서버로 검색 요청을 보낼 수 있습니다.

    // 디바운스 적용 (300ms 딜레이)
    // const debouncedSearch = debounce(searchQuery, 300);

    // // 키보드 이벤트 처리
    // document.getElementById('search-input').addEventListener('keyup', function(e) {
    // debouncedSearch(e.target.value);
    // });
 *  */
export function debounce<F extends (...args: Parameters<F>) => ReturnType<F>>(
  func: F,
  waitFor: number,
): (...args: Parameters<F>) => void {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<F>): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitFor);
  };
}
