import React from 'react';

const LargeChevronRight = ({ width, height, className, ...props }: React.SVGProps<SVGSVGElement>) => {
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
        d="M0.318284 0.439378C-0.0722405 0.829902 -0.0722405 1.46307 0.318284 1.85359L7.61118 9.14648L0.318283 16.4394C-0.0722412 16.8299 -0.0722412 17.4631 0.318283 17.8536C0.708807 18.2441 1.34197 18.2441 1.7325 17.8536L9.7325 9.85359C10.123 9.46307 10.123 8.8299 9.7325 8.43938L1.7325 0.439378C1.34197 0.0488534 0.708808 0.0488533 0.318284 0.439378Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default LargeChevronRight;
