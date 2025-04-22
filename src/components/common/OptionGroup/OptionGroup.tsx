import { iconMap } from '@/components/common/Icon/assets';
import Icon from '@/components/common/Icon/Icon';
import Typography from '@/components/common/Typography';

type Option = {
  value: string;
  label: string;
  icon?: keyof typeof iconMap;
};

type OptionGroupProps = {
  options: Option[];
  onSelect: (value: string) => void;
  selectedValue?: string;
};

export const OptionGroup = ({ options, selectedValue, onSelect }: OptionGroupProps) => {
  return (
    <ul role="listbox" className="w-60 mt-1 rounded border border-gray-30 bg-gray-0 p-space-6 focus:outline-none">
      {options.map((option) => (
        <li
          key={option.value}
          role="option"
          aria-selected={option.value === selectedValue}
          tabIndex={0}
          onClick={() => onSelect(option.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelect(option.value);
            }
          }}
          className="cursor-pointer px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 outline-none flex items-center gap-2"
        >
          <Typography type="Body3Medium">{option.label}</Typography>
          {option.icon && <Icon size={20} icon={option.icon} />}
        </li>
      ))}
    </ul>
  );
};

{
  /* <select
  className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
  aria-labelledby="option-label"
  value={selectedValue}
  onChange={(e) => onChange(e.target.value)}
>
  {options.map((opt) => (
    <option key={opt.value} value={opt.value}>
      {typeof opt.label === 'string' ? opt.label : '아이콘 포함 옵션'}
    </option>
  ))}
</select> */
}
