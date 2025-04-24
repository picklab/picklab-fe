import SortTab from '@/components/common/Tab/SortTab';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof SortTab> = {
  title: 'components/SortTab',
  component: SortTab,
  parameters: {
    query: {
      sort: 'soon',
    },
  },
};

export default meta;

type Story = StoryObj<typeof SortTab>;

const ControlItems = [
  { label: '최신순', value: 'latest' },
  { label: '마감 임박순', value: 'soon' },
  { label: '여유 있는순', value: 'remain' },
];

export const Basic: Story = {
  render: () => <SortTab options={ControlItems} />,
};
