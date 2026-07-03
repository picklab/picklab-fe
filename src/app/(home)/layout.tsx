import React, { Suspense } from 'react';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {/* Main Content — 푸터는 전역(root layout)에서 렌더 */}
      <main className="mx-auto pc:max-w-[1100px] mobile:max-w-[335px] mb-10">
        <Suspense fallback={<div>Loading activities...</div>}>{children}</Suspense>
      </main>
    </div>
  );
}
