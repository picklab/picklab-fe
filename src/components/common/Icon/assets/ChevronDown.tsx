import React from 'react';

const ChevronDown = ({ width, height, className, ...props }: React.SVGProps<SVGSVGElement>) => {
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
        d="M5.74311 9.6435C6.036 9.3506 6.51087 9.3506 6.80377 9.6435L12.2734 15.1132L17.7431 9.6435C18.036 9.3506 18.5109 9.3506 18.8038 9.6435C19.0967 9.93639 19.0967 10.4113 18.8038 10.7042L12.8038 16.7042C12.5109 16.9971 12.036 16.9971 11.7431 16.7042L5.74311 10.7042C5.45021 10.4113 5.45021 9.93639 5.74311 9.6435Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default ChevronDown;
