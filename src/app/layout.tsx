/** @format */

import type { Metadata } from "next";
import { cookies } from "next/headers";

import "./globals.css";
import GNBPC from "@/components/common/GNB/pc/GNB";
import GNBMobile from "@/components/common/GNB/mobile/GNB";
import { Providers } from "@/providers/providers";

export const metadata: Metadata = {
  title: "PickLab",
  description: "PickLab",
};

export default async function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const isLogin = !!cookieStore.get("accessToken");

  return (
    <html lang="en">
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
