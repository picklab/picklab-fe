import React from 'react';

const ChevronDown = ({ width, height, ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width={width} height={height} viewBox="0 0 15 9" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.789982 1.03412C1.08288 0.74123 1.55775 0.74123 1.85064 1.03412L7.32031 6.50379L12.79 1.03412C13.0829 0.74123 13.5577 0.74123 13.8506 1.03412C14.1435 1.32702 14.1435 1.80189 13.8506 2.09478L7.85064 8.09478C7.55775 8.38768 7.08288 8.38768 6.78998 8.09478L0.789982 2.09478C0.497089 1.80189 0.497089 1.32702 0.789982 1.03412Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default ChevronDown;
