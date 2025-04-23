import React from 'react';

import BoxTab from '@/components/common/Tab/BoxTab';
import Tab from '@/components/common/Tab/Tab';
import { PageProps } from '../../../../.next/types/app/page';
import { redirect } from 'next/navigation';

// 개별 탭 아이템의 타입 정의 (기본 탭)
interface TabItem {
  type?: 'default';
  label: React.ReactNode;
  id: string;
  panelId: string;
  panelComponent: React.ReactNode;
}

// 박스형 탭 아이템의 타입 정의
interface BoxTabItem {
  type: 'box';
  label: string;
  notiNumber: string;
  id: string;
  panelId: string;
  panelComponent: React.ReactNode;
}

// 두 타입을 합친 공통 타입
export type CombinedTabItem = TabItem | BoxTabItem;

// TabView 컴포넌트 props 정의
interface TabViewProps {
  items: CombinedTabItem[];
  searchParams: PageProps['searchParams'];
}

// 탭 뷰 렌더링 컴포넌트
const TabView = ({ items, searchParams }: TabViewProps) => {
  // 해당 panelId를 가진 아이템을 찾음
  const activeItem = items.find((item) => item.panelId === searchParams?.tab);

  // 주어진 key의 query param을 업데이트한 새 URL 생성(Util화 가능)
  const getUpdatedHref = (keyParam: string, panelId: string) => {
    const params = new URLSearchParams();

    if (searchParams) {
      Object.entries(searchParams).forEach(([key, value]) => {
        if (typeof value === 'string') {
          params.set(key, value);
        }
      });
    }
    params.set(keyParam, panelId);
    return `?${params.toString()}`;
  };

  // activeItem이 없다면 ?tab=edu로 강제 이동
  if (!activeItem) {
    redirect(getUpdatedHref('tab', 'edu'));
  }

  return (
    <>
      {/* 탭 리스트 렌더링 */}
      <div role="tablist" aria-orientation="horizontal" className="flex cursor-pointer">
        {items.map((item) => {
          const commonProps = {
            id: item.id,
            panelId: item.panelId,
            active: item.panelId === searchParams?.tab,
          };

          // 박스형 탭일 경우 BoxTab 렌더링
          if (item.type === 'box') {
            return (
              <BoxTab
                href={getUpdatedHref('tab', item.panelId)}
                key={item.id}
                {...commonProps}
                label={item.label}
                notiNumber={item.notiNumber}
              />
            );
          }

          // 기본 탭 렌더링
          return (
            <Tab href={getUpdatedHref('tab', item.panelId)} key={item.id} {...commonProps}>
              {item.label}
            </Tab>
          );
        })}
      </div>

      {/* 활성화된 탭의 콘텐츠 렌더링 */}
      <div role="tabpanel" id={`panel-${activeItem?.panelId}`} aria-labelledby={activeItem?.id}>
        {activeItem?.panelComponent}
      </div>
    </>
  );
};

export default TabView;
