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
  // Figma: 라벨은 17px Medium(활성·비활성 동일), 숫자는 20px(활성 SemiBold / 비활성 Medium)
  const notiType = active ? "Heading2Semibold" : "Heading2Medium";

  return (
    <Link
      href={href}
      className={clsx(
        // 각 경계에 border를 하나만 둔다: 왼쪽 border로 구분선(겹침 없음 → 이중선·삐짐 없음),
        // 마지막 박스만 오른쪽 border로 그룹 끝을 닫는다.
        "box-tab relative box-border flex h-[90px] w-full flex-col items-center justify-center border-y-2 border-l-2 border-gray-30 bg-white text-gray-50 last:border-r-2",
        // 활성 박스는 자기 사방(위/아래/왼쪽 + 오른쪽)을 초록 border로. 오른쪽도 자기 border라야
        // 모서리(border-y와 만나는 지점)까지 초록으로 꽉 찬다. 다음 박스의 왼쪽 border는 부모에서 제거해 이중선 방지.
        active && "text-primary-50 !border-primary-50 border-r-2",
        className,
      )}
      role="tab"
      aria-selected={active}
      aria-controls={`panel-${panelId}`}
      tabIndex={active ? 0 : -1}
      id={id}
      {...props}>
      <Typography type="Headline2Medium">{label}</Typography>
      <Typography type={notiType}>{`+${notiNumber}`}</Typography>
    </Link>
  );
};

export default BoxTab;
