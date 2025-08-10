import React from 'react';

const Eye = ({ width, height, className, ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M0.915466 7.57748C0.693477 7.22132 0.693477 6.7787 0.915466 6.42254C1.69386 5.17368 3.81437 2.33334 7.00001 2.33334C10.1856 2.33334 12.3062 5.17368 13.0846 6.42254C13.3065 6.7787 13.3065 7.22132 13.0846 7.57748C12.3062 8.82634 10.1856 11.6667 7.00001 11.6667C3.81438 11.6667 1.69386 8.82634 0.915466 7.57748Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 8.75C7.9665 8.75 8.75 7.9665 8.75 7C8.75 6.0335 7.9665 5.25 7 5.25C6.0335 5.25 5.25 6.0335 5.25 7C5.25 7.9665 6.0335 8.75 7 8.75Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Eye;
