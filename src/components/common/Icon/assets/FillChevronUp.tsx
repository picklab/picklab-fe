import React from 'react';

const FillChevronUp = ({ width, height, className, ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 10 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M4.57631 2.5703C4.77581 2.29253 5.18904 2.29253 5.38853 2.5703L8.41383 6.78254C8.65142 7.11335 8.415 7.57422 8.00772 7.57422L1.95712 7.57422C1.54984 7.57422 1.31343 7.11335 1.55101 6.78254L4.57631 2.5703Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default FillChevronUp;
