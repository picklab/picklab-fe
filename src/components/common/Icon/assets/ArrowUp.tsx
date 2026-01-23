import React from 'react';

const ArrowUp = ({ width, height, className, ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M12.7933 18.8154L12.7894 18.8916C12.751 19.2698 12.4317 19.5654 12.0433 19.5654C11.655 19.5654 11.3356 19.2698 11.2972 18.8916L11.2933 18.8154L11.2933 7.99512C11.2933 7.5809 11.6291 7.24512 12.0433 7.24512C12.4575 7.24512 12.7933 7.5809 12.7933 7.99512L12.7933 18.8154Z"
        fill="currentColor"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M6.02283 13.1983C6.29286 13.4683 6.73066 13.4683 7.00069 13.1983L12.0433 8.15563L17.086 13.1983C17.356 13.4683 17.7938 13.4683 18.0638 13.1983C18.3339 12.9283 18.3339 12.4905 18.0638 12.2204L12.5323 6.68885C12.2622 6.41882 11.8244 6.41882 11.5544 6.68885L6.02283 12.2204C5.75281 12.4905 5.75281 12.9283 6.02283 13.1983Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default ArrowUp;
