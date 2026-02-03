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

const BoxTab = ({ label, notiNumber, href, id, panelId, active, className, ...props }: BoxTabProps) => {
  const activeTypoType = active ? "Headline1SemiBold" : "Body1Medium";

  return (
    <Link
      href={href}
      className={clsx(
        "box-tab flex flex-col justify-center items-center box-border w-full h-[90px] p-[3px] pr-0 bg-gray-30",
        active && "!bg-primary-50",
        className
      )}
      role="tab"
      aria-selected={active}
      aria-controls={`panel-${panelId}`}
      tabIndex={active ? 0 : -1}
      id={id}
      {...props}
    >
      <span
        className={clsx(
          "flex flex-col justify-center items-center text-gray-50 bg-white w-full h-full",
          active && "!text-primary-50"
        )}
      >
        <Typography type={activeTypoType}>{label}</Typography>
        <Typography type={activeTypoType}>{`+${notiNumber}`}</Typography>
      </span>
    </Link>
  );
};

export default BoxTab;
