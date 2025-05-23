import React from 'react';

const LargeHuman = ({ width, height, className, ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 33 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.3867 10.1051C11.3867 12.6825 13.4761 14.7718 16.0534 14.7718C18.6307 14.7718 20.7201 12.6825 20.7201 10.1051C20.7201 7.52781 18.6307 5.43848 16.0534 5.43848C13.4761 5.43848 11.3867 7.52781 11.3867 10.1051ZM16.0534 3.43848C12.3715 3.43848 9.38672 6.42325 9.38672 10.1051C9.38672 13.787 12.3715 16.7718 16.0534 16.7718C19.7353 16.7718 22.7201 13.787 22.7201 10.1051C22.7201 6.42325 19.7353 3.43848 16.0534 3.43848Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.0537 21.7715C10.1753 21.7715 7.09923 25.8502 6.31546 27.8095C6.11035 28.3223 5.52838 28.5718 5.01559 28.3667C4.50282 28.1615 4.25339 27.5795 4.45851 27.0668C5.45252 24.5818 9.13196 19.7715 16.0537 19.7715C22.9753 19.7715 26.6547 24.5818 27.6487 27.0668C27.8539 27.5795 27.6045 28.1615 27.0917 28.3667C26.5789 28.5718 25.997 28.3223 25.7918 27.8095C25.0081 25.8502 21.9319 21.7715 16.0537 21.7715Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default LargeHuman;
