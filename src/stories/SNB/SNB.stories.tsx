import { setInitialPathname } from '@/__mocks__/next/navigation';
import SNB from '@/components/common/SNB/SNB';
import type { Meta, StoryObj } from '@storybook/react';

type SNBStoryProps = React.ComponentProps<typeof SNB> & { pathname?: string };

const meta: Meta<SNBStoryProps> = {
  title: 'Components/SNB/SNB',
  component: SNB,
  tags: ['autodocs'],
  args: {
    Jobs: ['프론트엔드', '기획', 'UX/UI'],
    pathname: '/my', // 기본 경로
  },
  decorators: [
    (Story, context) => {
      setInitialPathname(context.args.pathname || '/my');
      return (
        <div className="border w-fit">
          <Story />
        </div>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<SNBStoryProps>;

export const Default: Story = {
  args: {
    pathname: '/my',
  },
};

export const SubMenu: Story = {
  args: {
    pathname: '/my/account/profile',
  },
};
