import BoxTab from '@/components/common/Tab/BoxTab';
import type { Meta, StoryObj } from '@storybook/react';

import { useState } from 'react';

const meta: Meta<typeof BoxTab> = {
  title: 'Components/Tab/BoxTab',
  component: BoxTab,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BoxTab>;

export const Default: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('tab1');

    return (
      <div role="tablist" className="flex">
        <BoxTab
          label="전체"
          notiNumber="12"
          href="#"
          id="tab1"
          panelId="panel1"
          active={activeTab === 'tab1'}
          onClick={() => setActiveTab('tab1')}
        />
        <BoxTab
          label="공지"
          notiNumber="3"
          href="#"
          id="tab2"
          panelId="panel2"
          active={activeTab === 'tab2'}
          onClick={() => setActiveTab('tab2')}
        />
        <BoxTab
          label="질문"
          notiNumber="8"
          href="#"
          id="tab3"
          panelId="panel3"
          active={activeTab === 'tab3'}
          onClick={() => setActiveTab('tab3')}
        />
      </div>
    );
  },
};
