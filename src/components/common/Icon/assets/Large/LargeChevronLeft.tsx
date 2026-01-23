import React from 'react';

const LargeChevronLeft = ({ width, height, className, ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 11 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.3438 0.439378C10.7343 0.829902 10.7343 1.46307 10.3438 1.85359L3.05093 9.14648L10.3438 16.4394C10.7344 16.8299 10.7344 17.4631 10.3438 17.8536C9.9533 18.2441 9.32014 18.2441 8.92961 17.8536L0.929612 9.85359C0.539088 9.46307 0.539088 8.8299 0.929612 8.43938L8.92961 0.439378C9.32014 0.0488534 9.9533 0.0488533 10.3438 0.439378Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default LargeChevronLeft;
