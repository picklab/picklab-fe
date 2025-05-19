import React from 'react';

const Ellipse = ({ width, height, className, ...props }: React.SVGProps<SVGSVGElement>) => {
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
        d="M12.543 6C12.543 9.31371 9.85668 12 6.54297 12C3.22926 12 0.542969 9.31371 0.542969 6C0.542969 2.68629 3.22926 0 6.54297 0C9.85668 0 12.543 2.68629 12.543 6Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default Ellipse;
