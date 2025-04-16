import React from 'react';

const ChevronLeft = ({ direction, width, height, className, ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox="0 0 9 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.82916 0.509587C8.12205 0.80248 8.12205 1.27735 7.82916 1.57025L2.35949 7.03992L7.82916 12.5096C8.12205 12.8025 8.12205 13.2774 7.82916 13.5702C7.53627 13.8631 7.06139 13.8631 6.7685 13.5702L0.768498 7.57025C0.475605 7.27735 0.475605 6.80248 0.768498 6.50959L6.7685 0.509587C7.06139 0.216694 7.53627 0.216694 7.82916 0.509587Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default ChevronLeft;
