import React from 'react';

const Human = ({ width, height, className, ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M8.5 7.05859C8.5 8.99159 10.067 10.5586 12 10.5586C13.933 10.5586 15.5 8.99159 15.5 7.05859C15.5 5.12559 13.933 3.55859 12 3.55859C10.067 3.55859 8.5 5.12559 8.5 7.05859ZM12 2.05859C9.23858 2.05859 7 4.29717 7 7.05859C7 9.82001 9.23858 12.0586 12 12.0586C14.7614 12.0586 17 9.82001 17 7.05859C17 4.29717 14.7614 2.05859 12 2.05859Z"
        fill="currentColor"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12.0002 15.8086C7.59146 15.8086 5.28438 18.8676 4.69655 20.3371C4.54272 20.7217 4.10624 20.9088 3.72165 20.755C3.33707 20.6011 3.15 20.1646 3.30384 19.7801C4.04935 17.9163 6.80893 14.3086 12.0002 14.3086C17.1914 14.3086 19.951 17.9163 20.6965 19.7801C20.8504 20.1646 20.6633 20.6011 20.2787 20.755C19.8941 20.9088 19.4577 20.7217 19.3038 20.3371C18.716 18.8676 16.4089 15.8086 12.0002 15.8086Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default Human;
