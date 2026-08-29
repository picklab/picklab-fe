/** @format */

"use client";

import { TabProps } from "@/components/common/Tab/Tab";
import Typography from "@/components/common/Typography";
import clsx from "clsx";
import Link from "next/link";
import React from "react";

interface BoxTabProps extends Omit<TabProps, "children"> {
  label: "전체" | "대외활동" | "강연/세미나" | "교육" | "공모전/해커톤";
  notiNumber: string;
  className?: string;
}

const BoxTab = ({
  label,
  notiNumber,
  href,
  id,
  panelId,
  active,
  className,
  ...props
}: BoxTabProps) => {
  const activeTypoType = active ? "Headline1SemiBold" : "Body1Medium";

  return (
    <Link
      href={href}
      className={clsx(
        // 구분선은 각 박스의 border-r 하나로 처리(겹침 없음 → 서브픽셀 삐짐 없음). 그룹 왼쪽 끝은 first:border-l.
        "box-tab relative box-border flex h-[90px] w-full flex-col items-center justify-center border-y-2 border-r-2 border-gray-30 bg-white text-gray-50 first:border-l-2",
        // 활성 강조는 outline(레이아웃에 영향 없이 박스 위에 그려져 이웃과 겹치거나 삐지지 않음).
        active &&
          "z-10 text-primary-50 outline outline-2 -outline-offset-2 outline-primary-50",
        className,
      )}
      role="tab"
      aria-selected={active}
      aria-controls={`panel-${panelId}`}
      tabIndex={active ? 0 : -1}
      id={id}
      {...props}>
      <Typography type={activeTypoType}>{label}</Typography>
      <Typography type={activeTypoType}>{`+${notiNumber}`}</Typography>
    </Link>
  );
};

export default BoxTab;
