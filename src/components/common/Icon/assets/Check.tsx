import React from 'react';

const Check = ({ width, height, className, ...props }: React.SVGProps<SVGSVGElement>) => {
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
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M17.7054 8.05365C17.9983 8.34655 17.9983 8.82142 17.7054 9.11431L10.7559 16.0638C10.6153 16.2045 10.4245 16.2835 10.2256 16.2835C10.0267 16.2835 9.83589 16.2045 9.69524 16.0638L6.29387 12.6622C6.00099 12.3693 6.001 11.8944 6.29391 11.6015C6.58681 11.3087 7.06169 11.3087 7.35457 11.6016L10.2256 14.4728L16.6448 8.05365C16.9377 7.76076 17.4125 7.76076 17.7054 8.05365Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default Check;
