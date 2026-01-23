import React from 'react';

const LargeRefresh = ({ width, height, className, ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 17 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M7.58398 1.81348L10.9173 5.14681L7.58398 8.48014M15.584 12.1468C15.584 13.5313 15.1734 14.8847 14.4043 16.0358C13.6351 17.1869 12.5419 18.0842 11.2628 18.614C9.98369 19.1438 8.57622 19.2824 7.21836 19.0123C5.86049 18.7422 4.61321 18.0755 3.63424 17.0966C2.65527 16.1176 1.98859 14.8703 1.71849 13.5124C1.44839 12.1546 1.58702 10.7471 2.11683 9.46803C2.64664 8.18894 3.54385 7.09569 4.695 6.32652C5.84614 5.55735 7.77407 4.83773 9.7077 5.22423"
        stroke="currentColor"
        strokeWidth="1.73333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default LargeRefresh;
