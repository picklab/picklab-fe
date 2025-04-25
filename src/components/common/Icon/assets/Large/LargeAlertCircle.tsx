import React from 'react';

const LargeAlertCircle = ({ width, height, className, ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.1322 2.43848C8.32065 2.43848 2.79883 7.9603 2.79883 14.7718C2.79883 21.5833 8.32065 27.1051 15.1322 27.1051C21.9437 27.1051 27.4655 21.5833 27.4655 14.7718C27.4655 7.9603 21.9437 2.43848 15.1322 2.43848ZM0.798828 14.7718C0.798828 6.85573 7.21608 0.438477 15.1322 0.438477C23.0482 0.438477 29.4655 6.85573 29.4655 14.7718C29.4655 22.6879 23.0482 29.1051 15.1322 29.1051C7.21608 29.1051 0.798828 22.6879 0.798828 14.7718Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.1322 7.41579C15.6844 7.41579 16.1322 7.86351 16.1322 8.41579V17.2998C16.1322 17.8521 15.6844 18.2998 15.1322 18.2998C14.5799 18.2998 14.1322 17.8521 14.1322 17.2998V8.41579C14.1322 7.86351 14.5799 7.41579 15.1322 7.41579Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.1322 19.6558C15.6844 19.6558 16.1322 20.1035 16.1322 20.6558V21.2792C16.1322 21.8315 15.6844 22.2792 15.1322 22.2792C14.5799 22.2792 14.1322 21.8315 14.1322 21.2792V20.6558C14.1322 20.1035 14.5799 19.6558 15.1322 19.6558Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default LargeAlertCircle;
