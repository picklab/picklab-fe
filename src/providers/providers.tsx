/** @format */

"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthClientProvider } from "@/contexts/AuthContext";

interface ProvidersProps {
  children: ReactNode;
  isLogin: boolean; // 서버 컴포넌트(루트 레이아웃)가 쿠키로 판단한 초기 로그인 상태
}

// 기존 수제 fetch 훅과 같은 동작을 유지하기 위한 기본값.
// - 실패 재시도, 창 포커스·재연결 시 재요청을 하지 않는다(기존에 없던 요청이 생기지 않게).
// - gcTime 0: 화면을 떠나면 캐시를 바로 버려 다음 화면은 기존처럼 새로 불러온다.
//   같은 화면에서 동시에 부르는 요청(PC·모바일 동시 마운트, SNB와 페이지 등)만 하나로 합쳐진다.
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: 0,
        gcTime: 0,
      },
    },
  });
}

export function Providers({ children, isLogin }: ProvidersProps) {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthClientProvider initialAuthStatus={isLogin}>{children}</AuthClientProvider>
    </QueryClientProvider>
  );
}
