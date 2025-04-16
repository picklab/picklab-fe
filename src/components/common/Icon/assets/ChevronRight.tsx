import React from 'react';

const ChevronRight = ({ direction, width, height, className, ...props }: React.SVGProps<SVGSVGElement>) => {
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
        d="M0.693791 0.509587C0.400898 0.80248 0.400898 1.27735 0.693791 1.57025L6.16346 7.03992L0.69379 12.5096C0.400897 12.8025 0.400897 13.2774 0.69379 13.5702C0.986684 13.8631 1.46156 13.8631 1.75445 13.5702L7.75445 7.57025C8.04734 7.27735 8.04734 6.80248 7.75445 6.50959L1.75445 0.509587C1.46156 0.216694 0.986684 0.216694 0.693791 0.509587Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default ChevronRight;
