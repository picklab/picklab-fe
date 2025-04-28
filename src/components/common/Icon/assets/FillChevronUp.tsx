import React from 'react';

const FillChevronUp = ({ width, height, className, ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M11.9716 7.82895C12.3667 7.40754 13.0356 7.40754 13.4307 7.82895L18.6225 13.3668C19.2212 14.0055 18.7684 15.0508 17.8929 15.0508L7.5094 15.0508C6.63396 15.0508 6.18112 14.0055 6.77987 13.3668L11.9716 7.82895Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default FillChevronUp;
