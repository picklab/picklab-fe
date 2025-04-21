import React, { useState } from 'react';
import Tab from './Tab';
import BoxTab from '@/components/common/Tab/BoxTab';

// 개별 탭 아이템의 타입 정의
interface TabItem {
  type?: 'default'; // 기본 탭
  label: React.ReactNode; // 탭에 표시될 라벨 텍스트 또는 노드
  id: string; // 탭 요소의 고유 ID (aria-labelledby 연결용)
  panelId: string; // 패널 요소의 고유 ID (aria-controls 연결용)
  panelComponent: React.ReactNode; // 탭 클릭 시 렌더링할 콘텐츠 영역
}

interface BoxTabItem {
  type: 'box'; // 박스형 탭임을 명시
  label: string; // 라벨
  notiNumber: string; // 알림 갯수
  id: string; // 탭 요소의 고유 ID (aria-labelledby 연결용)
  panelId: string; // 패널 요소의 고유 ID (aria-controls 연결용)
  panelComponent: React.ReactNode; // 탭 클릭 시 렌더링할 콘텐츠 영역
}

export type CombinedTabItem = TabItem | BoxTabItem;

// TabView 컴포넌트 props 정의
interface TabViewProps {
  items: CombinedTabItem[]; // 탭 목록 배열
  defaultIndex?: number; // 초기 활성화할 탭 인덱스 (기본값: 0)
}

// TabView: 탭 버튼과 해당 콘텐츠 패널을 함께 렌더링하는 컴포넌트
const TabView = ({ items, defaultIndex = 0 }: TabViewProps) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  return (
    <>
      <div role="tablist" aria-orientation="horizontal" className="flex cursor-pointer">
        {items.map((item, index) => {
          const commonProps = {
            key: item.id,
            id: item.id,
            panelId: item.panelId,
            active: index === activeIndex,
            onClick: () => setActiveIndex(index),
          };

          // BoxTab 렌더링
          if (item.type === 'box') {
            return <BoxTab {...commonProps} label={item.label} notiNumber={item.notiNumber} />;
          }

          // 기본 Tab 렌더링
          return <Tab {...commonProps}>{item.label}</Tab>;
        })}
      </div>

      {/* 컴포넌트 렌더링 */}
      <div role="tabpanel" id={items[activeIndex].panelId} aria-labelledby={items[activeIndex].id}>
        {items[activeIndex].panelComponent}
      </div>
    </>
  );
};

export default TabView;
