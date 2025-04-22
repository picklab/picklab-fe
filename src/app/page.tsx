'use client';

import { iconMap } from '@/components/common/Icon/assets';
import { OptionGroup } from '@/components/common/OptionGroup/OptionGroup';
import { useState } from 'react';

export default function Home() {
  const [selected, setSelected] = useState('label1');

  const options = [
    { value: 'label1', label: '라벨1' },
    { value: 'label2', label: '라벨2', icon: 'alertCircle' as keyof typeof iconMap },
    { value: 'label3', label: '라벨3', icon: 'check' as keyof typeof iconMap },
  ];
  return (
    <div className="text-2xl">
      <OptionGroup options={options} selectedValue={selected} onSelect={setSelected} />
    </div>
  );
}
