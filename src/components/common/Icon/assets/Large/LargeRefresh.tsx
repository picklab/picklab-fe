import React from 'react';

const LargeRefresh = ({ width, height, className, ...props }: React.SVGProps<SVGSVGElement>) => {
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
        d="M11.5 5L14 7.5L11.5 10M17.5 12.75C17.5 13.7884 17.1921 14.8034 16.6152 15.6667C16.0383 16.5301 15.2184 17.203 14.2591 17.6004C13.2998 17.9977 12.2442 18.1017 11.2258 17.8991C10.2074 17.6965 9.27192 17.1965 8.53769 16.4623C7.80347 15.7281 7.30345 14.7926 7.10088 13.7742C6.89831 12.7558 7.00227 11.7002 7.39963 10.7409C7.79699 9.7816 8.4699 8.96166 9.33326 8.38478C10.1966 7.80791 11.6426 7.26819 13.0928 7.55807"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default LargeRefresh;
