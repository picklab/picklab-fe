import { setInitialSearchParams } from '@/__mocks__/next/navigation';
import SortTab from '@/components/common/Tab/SortTab';
import type { Meta, StoryObj } from '@storybook/react';

const ControlItems = [
  { label: '최신순', value: 'latest' },
  { label: '마감 임박순', value: 'soon' },
  { label: '여유 있는순', value: 'remain' },
];

const meta: Meta<typeof SortTab> = {
  title: 'components/Tab/SortTab',
  component: SortTab,
  tags: ['autodocs'],
  decorators: [
    (Story, context) => {
      const sort = context.parameters.query?.sort ?? 'latest';
      if (context.parameters.query) {
        setInitialSearchParams({ sort });
      }
      return <Story />;
    },
  ],
};

export default meta;

type Story = StoryObj<typeof SortTab>;

export const Playground: Story = {
  name: 'SortTab',
  parameters: {
    query: { sort: 'latest' }, // 기본값 설정
  },
  render: () => <SortTab options={ControlItems} />,
};
