import React from 'react';

const FillChevronDown = ({ width, height, className, ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 10 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M5.42369 8.4297C5.22419 8.70747 4.81096 8.70747 4.61147 8.4297L1.58617 4.21746C1.34858 3.88665 1.585 3.42578 1.99228 3.42578L8.04288 3.42578C8.45016 3.42578 8.68657 3.88665 8.44899 4.21746L5.42369 8.4297Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default FillChevronDown;
