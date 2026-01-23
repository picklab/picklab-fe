import React from 'react';

const ThreeDots = ({ width, height, className, ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      width={width}
      height={height}
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 13.5182C12.5523 13.5182 13 13.0705 13 12.5182C13 11.9659 12.5523 11.5182 12 11.5182C11.4477 11.5182 11 11.9659 11 12.5182C11 13.0705 11.4477 13.5182 12 13.5182Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 13.5182C19.5523 13.5182 20 13.0705 20 12.5182C20 11.9659 19.5523 11.5182 19 11.5182C18.4477 11.5182 18 11.9659 18 12.5182C18 13.0705 18.4477 13.5182 19 13.5182Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 13.5182C5.55228 13.5182 6 13.0705 6 12.5182C6 11.9659 5.55228 11.5182 5 11.5182C4.44772 11.5182 4 11.9659 4 12.5182C4 13.0705 4.44772 13.5182 5 13.5182Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ThreeDots;
