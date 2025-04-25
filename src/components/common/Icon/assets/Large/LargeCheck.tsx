import React from 'react';

const LargeCheck = ({ width, height, className, ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 17 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.1372 0.806565C16.5277 1.19709 16.5277 1.83025 16.1372 2.22078L6.87117 11.4868C6.68363 11.6743 6.42927 11.7797 6.16404 11.7797C5.89882 11.7797 5.64446 11.6743 5.45693 11.4868L0.921774 6.9513C0.531264 6.56076 0.531287 5.92759 0.921825 5.53708C1.31236 5.14657 1.94553 5.1466 2.33604 5.53713L6.16409 9.36546L14.723 0.806565C15.1135 0.416041 15.7467 0.416041 16.1372 0.806565Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default LargeCheck;
