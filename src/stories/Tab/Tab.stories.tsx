import Tab from '@/components/common/Tab/Tab';
import type { Meta, StoryObj } from '@storybook/react';

import { useState } from 'react';

const meta: Meta<typeof Tab> = {
  title: 'Components/Tab/Tab',
  component: Tab,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tab>;

const TabWithState = () => {
  const [activeTab, setActiveTab] = useState('tab1');

  return (
    <div role="tablist" className="flex">
      <Tab href="#1" id="tab1" panelId="panel1" active={activeTab === 'tab1'} onClick={() => setActiveTab('tab1')}>
        탭 1
      </Tab>
      <Tab href="#2" id="tab2" panelId="panel2" active={activeTab === 'tab2'} onClick={() => setActiveTab('tab2')}>
        탭 2
      </Tab>
      <Tab href="#3" id="tab3" panelId="panel3" active={activeTab === 'tab3'} onClick={() => setActiveTab('tab3')}>
        탭 3
      </Tab>
    </div>
  );
};

export const Default: Story = {
  render: () => <TabWithState />,
};
