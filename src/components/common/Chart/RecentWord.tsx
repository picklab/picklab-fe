import Icon from '@/components/common/Icon/Icon';
import Typography from '@/components/common/Typography';
import React from 'react';

interface keywordTypes {
  id: number;
  word: string;
}

interface RecentWordProps {
  keyword: keywordTypes;
  removeHandler: (id: number) => void;
}

const RecentWord = ({ keyword, removeHandler }: RecentWordProps) => {
  return (
    <div className="flex items-center pl-space-12 pr-space-10 py-space-6 gap-1 bg-gray-10 rounded-full w-fit">
      <Typography type="Body4Medium" className="text-gray-50">
        {keyword.word}
      </Typography>
      <button onClick={() => removeHandler(keyword.id)} className="text-gray-500 hover:text-red-500">
        <Icon icon="xMark" size={18} className="text-gray-50" />
      </button>
    </div>
  );
};

export default RecentWord;
