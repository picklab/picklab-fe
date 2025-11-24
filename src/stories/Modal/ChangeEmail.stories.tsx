import { Meta, StoryObj } from '@storybook/react';
import ChangeEmailPage from '@/app/@modal/change-email/page';
import { ModalProvider } from '@/contexts/ModalContext';
import { Button } from '@storybook/react-day-picker';

const meta: Meta = {
  title: 'Pages/Modal',
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'white',
      values: [{ name: 'white', value: '#ffffff' }],
    },
  },
  decorators: [
    (Story) => (
      <ModalProvider>
        <Story />
      </ModalProvider>
    ),
  ],
};

export default meta;

export const ChangeEmail: StoryObj<typeof ChangeEmailPage> = {
  render: () => (
    <main className="mx-auto pc:max-w-[1100px] mobile:max-w-[335px] mb-10">
      <ChangeEmailPage />
    </main>
  ),
  parameters: {
    docs: {
      description: {
        story: '이메일 변경 모달입니다.',
      },
    },
  },
};
