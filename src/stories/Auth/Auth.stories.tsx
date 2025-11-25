import { Meta, StoryObj } from '@storybook/react';
import AuthPage from '@/app/(auth)/signin/page';

const meta: Meta = {
  title: 'Pages/Auth',
  component: AuthPage,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'white',
      values: [{ name: 'white', value: '#ffffff' }],
    },
  },
};

export default meta;

export const Default: StoryObj<typeof AuthPage> = {
  name: 'Signin',
  parameters: {
    docs: {
      description: {
        story: '로그인 페이지입니다. 뷰포트 애드온을 통해 PC와 모바일 화면을 확인할 수 있습니다.',
      },
    },
  },
  render: () => <AuthPage />,
};
