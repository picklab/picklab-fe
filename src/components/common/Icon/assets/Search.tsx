import React from 'react';

const Search = ({ width, height, className, ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.125 5.18359C7.81129 5.18359 5.125 7.86989 5.125 11.1836C5.125 14.4973 7.81129 17.1836 11.125 17.1836C14.4387 17.1836 17.125 14.4973 17.125 11.1836C17.125 7.86989 14.4387 5.18359 11.125 5.18359ZM3.625 11.1836C3.625 7.04146 6.98286 3.68359 11.125 3.68359C15.2671 3.68359 18.625 7.04146 18.625 11.1836C18.625 15.3257 15.2671 18.6836 11.125 18.6836C6.98286 18.6836 3.625 15.3257 3.625 11.1836Z"
        fill="currentColor"
      />
      <path
        d="M19.0947 20.2139C19.3876 20.5068 19.8624 20.5068 20.1553 20.2139C20.4482 19.921 20.4482 19.4462 20.1553 19.1533L19.0947 20.2139ZM20.1553 19.1533L16.6553 15.6533L15.5947 16.7139L19.0947 20.2139L20.1553 19.1533Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default Search;
