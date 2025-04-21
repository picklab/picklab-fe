import { TabProps } from '@/components/common/Tab/Tab';
import Typography from '@/components/common/Typography';
import clsx from 'clsx';
import React from 'react';

interface BoxTabProps extends Omit<TabProps, 'children'> {
  label: string; // 라벨
  notiNumber: string; // 알림 갯수
}
const BoxTab = ({ label, notiNumber, id, panelId, active, ...props }: BoxTabProps) => {
  const activeTypoType = active ? 'Title3Bold' : 'Title3Medium';

  return (
    // border의 기본적 스타일 특성 떄문에 아래와 같이 바탕이 되는 div에 padding 3px, background-color를 이용하여 border효과를 주었고, active 스타일을 추가하였습니다!
    // tailwind 코드가 난잡해질까 globals.css에 box-tab class에 스타일링 작성하였습니다! 참고 부탁드립니다!
    <div
      className={clsx(
        'box-tab flex flex-col justify-center items-center box-border w-[240px] h-[120px] p-[3px] pr-0 bg-gray-40',
        active && '!bg-black',
      )}
      role="tab" // 접근성을 위한 역할 지정
      aria-selected={`${active}`} // 현재 탭이 선택되었는지 여부
      aria-controls={panelId} // 연결된 tabpanel ID
      tabIndex={active ? 0 : -1} // 포커스 관리
      id={id} // 고유 ID
    >
      <div
        className={clsx(
          'flex flex-col justify-center items-center text-gray-50 bg-white w-full h-full',
          active && '!border-gray-90  !text-black', // 활성화 시 스타일
        )}
        {...props}
      >
        <Typography type={activeTypoType}>{`${label}`}</Typography>
        <Typography type={activeTypoType}>{`+${notiNumber}`}</Typography>
      </div>
    </div>
  );
};

export default BoxTab;
