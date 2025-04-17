import React from 'react';

const Check = ({ width, height, className, ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_308_21779)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.5614 2.12677C12.8543 2.41967 12.8543 2.89454 12.5614 3.18743L5.61187 10.137C5.47122 10.2776 5.28045 10.3566 5.08153 10.3566C4.88261 10.3566 4.69184 10.2776 4.55119 10.1369L1.14983 6.73532C0.856944 6.44242 0.856961 5.96755 1.14986 5.67466C1.44277 5.38178 1.91764 5.3818 2.21052 5.6747L5.08156 8.54594L11.5007 2.12677C11.7936 1.83388 12.2685 1.83388 12.5614 2.12677Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_308_21779">
          <rect width="12" height="12" fill="currentColor" transform="translate(0.855469 0.131836)" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default Check;
