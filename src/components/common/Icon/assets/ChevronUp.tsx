import React from 'react';

const ChevronUp = ({ width, height, className, ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.46186 14.7042C5.75475 14.9971 6.22962 14.9971 6.52252 14.7042L11.9922 9.23449L17.4619 14.7042C17.7548 14.9971 18.2296 14.9971 18.5225 14.7042C18.8154 14.4113 18.8154 13.9364 18.5225 13.6435L12.5225 7.6435C12.2296 7.35061 11.7548 7.35061 11.4619 7.6435L5.46186 13.6435C5.16896 13.9364 5.16896 14.4113 5.46186 14.7042Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default ChevronUp;
