import React from 'react';

const AlertCircle = ({ width, height, className, ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2.75C6.89137 2.75 2.75 6.89137 2.75 12C2.75 17.1086 6.89137 21.25 12 21.25C17.1086 21.25 21.25 17.1086 21.25 12C21.25 6.89137 17.1086 2.75 12 2.75ZM1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 6.48303C12.4142 6.48303 12.75 6.81882 12.75 7.23303V13.8961C12.75 14.3103 12.4142 14.6461 12 14.6461C11.5858 14.6461 11.25 14.3103 11.25 13.8961V7.23303C11.25 6.81882 11.5858 6.48303 12 6.48303Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 15.663C12.4142 15.663 12.75 15.9988 12.75 16.413V16.8805C12.75 17.2947 12.4142 17.6305 12 17.6305C11.5858 17.6305 11.25 17.2947 11.25 16.8805V16.413C11.25 15.9988 11.5858 15.663 12 15.663Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default AlertCircle;
