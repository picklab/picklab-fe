import React from 'react';

const LargeSearch = ({ width, height, className, ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 23 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {' '}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.5508 2.60449C6.1325 2.60449 2.55078 6.18621 2.55078 10.6045C2.55078 15.0228 6.1325 18.6045 10.5508 18.6045C14.9691 18.6045 18.5508 15.0228 18.5508 10.6045C18.5508 6.18621 14.9691 2.60449 10.5508 2.60449ZM0.550781 10.6045C0.550781 5.08164 5.02793 0.604492 10.5508 0.604492C16.0736 0.604492 20.5508 5.08164 20.5508 10.6045C20.5508 16.1273 16.0736 20.6045 10.5508 20.6045C5.02793 20.6045 0.550781 16.1273 0.550781 10.6045Z"
        fill="currentColor"
      />
      <path
        d="M21.177 22.6449C21.5676 23.0355 22.2006 23.0355 22.5912 22.6449C22.9817 22.2544 22.9817 21.6213 22.5912 21.2308L21.177 22.6449ZM22.5912 21.2308L17.9245 16.5641L16.5104 17.9783L21.177 22.6449L22.5912 21.2308Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default LargeSearch;
