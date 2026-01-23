import React from 'react';

const ArrowDown = ({ width, height, className, ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M12.043 5.55371C12.4313 5.55371 12.7507 5.84936 12.7891 6.22754L12.793 6.30371V16.2139L17.086 11.9209C17.3559 11.6509 17.7935 11.6511 18.0635 11.9209C18.3336 12.1909 18.3336 12.6284 18.0635 12.8984L12.5323 18.4307C12.2623 18.7003 11.8247 18.7003 11.5547 18.4307L6.02251 12.8984C5.75295 12.6285 5.75287 12.1908 6.02251 11.9209C6.29254 11.6509 6.731 11.6509 7.00103 11.9209L11.293 16.2129V6.30371L11.2969 6.22754C11.3353 5.84949 11.6549 5.55395 12.043 5.55371Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default ArrowDown;
