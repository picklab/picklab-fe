import React from 'react';

const ArrowUp = ({ width, height, className, ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 13 14"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7.29333 12.7568L7.28943 12.833C7.25103 13.2112 6.93167 13.5068 6.54333 13.5068C6.155 13.5068 5.83564 13.2112 5.79724 12.833L5.79333 12.7568L5.79333 1.93652C5.79333 1.52231 6.12912 1.18652 6.54333 1.18652C6.95755 1.18652 7.29333 1.52231 7.29333 1.93652L7.29333 12.7568Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.522833 7.13968C0.792859 7.40971 1.23066 7.40971 1.50069 7.13968L6.54333 2.09704L11.586 7.13968C11.856 7.40971 12.2938 7.40971 12.5638 7.13968C12.8339 6.86966 12.8339 6.43186 12.5638 6.16183L7.03226 0.630254C6.76223 0.360228 6.32444 0.360228 6.05441 0.630254L0.522833 6.16183C0.252806 6.43186 0.252806 6.86966 0.522833 7.13968Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default ArrowUp;
