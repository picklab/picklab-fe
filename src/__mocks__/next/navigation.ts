'use client';

import React from 'react';

// URLSearchParams의 상태를 추적하기 위한 변수
let currentSearchParams = new URLSearchParams();

// 초기 searchParams를 설정하는 함수
export const setInitialSearchParams = (params: Record<string, string>) => {
  // searchParams를 새로 초기화
  currentSearchParams = new URLSearchParams();

  // 전달된 params를 currentSearchParams에 설정
  for (const key in params) {
    currentSearchParams.set(key, params[key]);
    notify(); // params 설정 후 상태 변경을 리스너들에게 알림
  }
};

// query가 바뀔 때 상태 변경을 위한 리스너 배열
const listeners = new Set<() => void>();

// 상태가 변경될 때마다 등록된 리스너들에게 알림을 보냄
const notify = () => {
  listeners.forEach((fn) => fn()); // 모든 리스너 함수 호출
};

// searchParams 상태를 사용할 수 있게 하는 훅
export const useSearchParams = () => {
  const [, forceUpdate] = React.useState(0); // 상태 변경을 위한 forceUpdate 함수

  React.useEffect(() => {
    // 상태 변경 시 컴포넌트를 리렌더링하기 위한 업데이트 함수
    const update = () => forceUpdate((n) => n + 1);

    // 리스너 등록
    listeners.add(update);

    // 컴포넌트 언마운트 시 리스너를 제거
    return () => {
      listeners.delete(update);
    };
  }, []); // 빈 배열을 전달하여 컴포넌트 마운트/언마운트 시 한 번만 실행되도록 설정

  return {
    // key에 해당하는 searchParams 값 가져오기
    get: (key: string) => currentSearchParams.get(key),

    // 전체 searchParams를 문자열 형태로 반환
    toString: () => currentSearchParams.toString(),
  };
};

// useRouter 훅을 모킹한 함수 (Next.js의 useRouter처럼 동작)
export const useRouter = () => ({
  // URL을 push하면서 searchParams를 갱신하는 함수
  push: (url: string) => {
    // 전달받은 URL에서 searchParams를 파싱하여 새로운 URLSearchParams 객체 생성
    const newParams = new URL(url, 'http://localhost').searchParams;

    // currentSearchParams를 새로운 파라미터로 업데이트
    currentSearchParams = new URLSearchParams(newParams.toString());

    // 상태 변경을 리스너들에게 알림
    notify();
  },
});

export const usePathname = () => {
  // 단순히 현재 경로를 반환
  // (현재까지 스토리북에서 해당 훅으로 어떤 작업을 하고있지 않아서 기본 리턴값 반환)
  return '/mock-path';
};
