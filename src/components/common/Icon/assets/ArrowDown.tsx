import React from 'react';

const ArrowDown = ({ width, height, className, ...props }: React.SVGProps<SVGSVGElement>) => {
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
        d="M6.50005 0.428711C6.88837 0.428711 7.20773 0.72436 7.24615 1.10254L7.25005 1.17871V11.0889L11.543 6.7959C11.813 6.52594 12.2505 6.52609 12.5206 6.7959C12.7906 7.06593 12.7906 7.50341 12.5206 7.77344L6.98931 13.3057C6.71935 13.5753 6.28174 13.5753 6.01177 13.3057L0.479546 7.77344C0.209984 7.50347 0.209902 7.06582 0.479546 6.7959C0.749573 6.52587 1.18803 6.52587 1.45806 6.7959L5.75005 11.0879V1.17871L5.75396 1.10254C5.79234 0.724491 6.11194 0.428951 6.50005 0.428711Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default ArrowDown;
