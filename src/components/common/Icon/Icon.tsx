import { iconMap, IconType } from '@/components/common/Icon/assets';
import clsx from 'clsx';

export type Props = {
  icon: IconType;
  size?: number;
  className?: string;
  ariaLabel?: string;
  role?: string;
} & React.SVGProps<SVGSVGElement>;

/**
 * 참고: check Icon은 크기가 작아 scale을 1.5배 키웠습니다!
 */
const Icon = ({ icon, size, className, ariaLabel, role, ...props }: Props) => {
  const IconSVGComponent = iconMap[icon];
  const checkStyle = icon === 'check' && 'scale-150';
  {
    /* 🔤 아무런 인터랙션없이 단지 이미지식의 아이콘일 경우만
    ariaLabel, role을 prop으로 주시면 됩니다
    */
  }
  {
    /* 🔤 인터랙션이 있는 아이콘인 경우에는
      ariaLabel, role을 prop으로 주지 않고, 이벤트가 달리는 버튼이나 인풋의 속성으로 주시면 됩니다
      해당 아이콘에도 접근성정보를 넣으면 중복으로 읽히는 문제가 발생할 수 있습니다
      */
  }

  const accessibilityProps = ariaLabel
    ? {
        role: role ?? 'img',
        'aria-label': ariaLabel,
      }
    : {
        'aria-hidden': true,
      };

  {
    /* 🔤 아이콘 color값을 tailwindcss 속성으로 사용하기 위해 
    color를 prop으로 받지 않고, className으로 전달
    (아이콘 컴포넌트에 color가 들어가는 부분을 currentColor로 변경해주세요.) */
  }
  return (
    <IconSVGComponent
      width={size}
      height={size}
      className={clsx(checkStyle, className)}
      {...accessibilityProps}
      {...props}
    />
  );
};

export default Icon;
