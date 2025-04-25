import React from 'react';

type ColorItemProps = {
  title: string;
  subtitle?: string;
  colors: Record<string, string>;
};

// 🏷️ Color 스토리북용 컴포넌트입니다

const ColorItem = ({ title, subtitle, colors }: ColorItemProps) => {
  return (
    <div className="mb-10">
      <div className="mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Object.entries(colors).map(([key, value]) => (
          <div key={key} className="flex flex-col items-start">
            <div className="w-full h-10 rounded border" style={{ backgroundColor: value }} />
            <div className="mt-1 text-xs text-gray-700 font-semibold">{key}</div>
            <div className="text-xs text-gray-500">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorItem;
