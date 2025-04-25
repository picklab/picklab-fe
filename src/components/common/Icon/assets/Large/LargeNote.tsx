import React from 'react';

const LargeNote = ({ width, height, className, ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 22 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M5.88932 7.77018H14.9283M5.88932 12.0566H11.0358M1.55078 4.17623C1.55078 2.84812 2.62742 1.77148 3.95552 1.77148H17.8127C19.1408 1.77148 20.2174 2.84812 20.2174 4.17623V23.3667C20.2174 24.6948 19.1408 25.7715 17.8127 25.7715H3.95552C2.62742 25.7715 1.55078 24.6948 1.55078 23.3667V4.17623Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};
export default LargeNote;
