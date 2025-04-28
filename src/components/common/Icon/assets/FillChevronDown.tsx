import React from 'react';

const FillChevronDown = ({ width, height, className, ...props }: React.SVGProps<SVGSVGElement>) => {
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
        d="M13.294 15.5744C12.8989 15.9958 12.23 15.9958 11.8349 15.5744L6.64315 10.0365C6.0444 9.39782 6.49725 8.35254 7.37268 8.35254L17.7562 8.35254C18.6317 8.35254 19.0845 9.39781 18.4858 10.0365L13.294 15.5744Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default FillChevronDown;
