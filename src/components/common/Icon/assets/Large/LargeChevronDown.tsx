import React from 'react';

const LargeChevronDown = ({ width, height, className, ...props }: React.SVGProps<SVGSVGElement>) => {
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
        d="M0.705003 0.772385C1.09553 0.381861 1.72869 0.381861 2.11922 0.772385L9.41211 8.06528L16.705 0.772385C17.0955 0.381861 17.7287 0.381861 18.1192 0.772385C18.5097 1.16291 18.5097 1.79607 18.1192 2.1866L10.1192 10.1866C9.72869 10.5771 9.09553 10.5771 8.705 10.1866L0.705003 2.1866C0.314478 1.79607 0.314478 1.16291 0.705003 0.772385Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default LargeChevronDown;
