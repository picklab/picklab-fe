import React from 'react';

const LargeChevronUp = ({ width, height, className, ...props }: React.SVGProps<SVGSVGElement>) => {
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
        d="M0.425706 10.5206C0.81623 10.9111 1.4494 10.9111 1.83992 10.5206L9.13281 3.22769L16.4257 10.5206C16.8162 10.9111 17.4494 10.9111 17.8399 10.5206C18.2304 10.1301 18.2304 9.49689 17.8399 9.10637L9.83992 1.10637C9.4494 0.715845 8.81623 0.715845 8.42571 1.10637L0.425706 9.10637C0.0351814 9.49689 0.0351814 10.1301 0.425706 10.5206Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default LargeChevronUp;
