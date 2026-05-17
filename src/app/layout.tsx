/** @format */

import type { Metadata } from "next";
import { cookies } from "next/headers";

import "./globals.css";
import GNBPC from "@/components/common/GNB/pc/GNB";
import GNBMobile from "@/components/common/GNB/mobile/GNB";
import { Providers } from "@/providers/providers";

export const metadata: Metadata = {
  title: {
    default: "PickLab | 대외활동, 공모전, 교육, 세미나 탐색",
    template: "%s | PickLab",
  },
  description: "대외활동, 강연·세미나, 교육, 공모전·해커톤 정보를 한 곳에서 탐색하는 PickLab입니다.",
  openGraph: {
    title: "PickLab | 대외활동, 공모전, 교육, 세미나 탐색",
    description: "대외활동, 강연·세미나, 교육, 공모전·해커톤 정보를 한 곳에서 탐색하는 PickLab입니다.",
    images: [
      {
        url: "/og-image.jpg",
        alt: "PickLab 대표 이미지",
      },
    ],
    type: "website",
    locale: "ko_KR",
    siteName: "PickLab",
  },
  twitter: {
    card: "summary_large_image",
    title: "PickLab | 대외활동, 공모전, 교육, 세미나 탐색",
    description: "대외활동, 강연·세미나, 교육, 공모전·해커톤 정보를 한 곳에서 탐색하는 PickLab입니다.",
    images: ["/og-image.jpg"],
  },
};

export default async function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const isLogin = !!(cookieStore.get("accessToken") || cookieStore.get("refreshToken"));

  return (
    <html lang="ko">
      <body>
        <Providers isLogin={isLogin}>
          <div className="mobile:hidden pc:flex  justify-center">
            <GNBPC isLogin={isLogin} />
          </div>
          <div className="pc:hidden mobile:flex  justify-center">
            <GNBMobile isLogin={isLogin} />
          </div>
          {children}
          {modal}
        </Providers>
      </body>
    </html>
  );
}
