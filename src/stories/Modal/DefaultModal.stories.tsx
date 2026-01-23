import { Meta, StoryObj } from '@storybook/react';
import DefaultModalPage from '@/app/@modal/default-modal/page';

const meta: Meta = {
  title: 'Pages/Modal',
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'white',
      values: [{ name: 'white', value: '#ffffff' }],
    },
  },
  decorators: [(Story) => <Story />],
};

export default meta;

export const DefaultModal: StoryObj<typeof DefaultModalPage> = {
  render: () => (
    <main className="mx-auto pc:max-w-[1100px] mobile:max-w-[335px] mb-10">
      <DefaultModalPage />
    </main>
  ),
  parameters: {
    docs: {
      description: {
        story: '기본 모달입니다.',
      },
    },
  },
};
