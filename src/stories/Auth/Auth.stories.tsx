import { Meta, StoryObj } from '@storybook/react';
import SigninPage from '@/app/(auth)/signin/page';
import SignupPage from '@/app/(auth)/signup/page';

const meta: Meta = {
  title: 'Pages/Auth',
  parameters: {
    layout: 'fullscreen',

    backgrounds: {
      default: 'white',
      values: [{ name: 'white', value: '#ffffff' }],
    },
  },
};

export default meta;

// Signin Page Story
export const Signin: StoryObj<typeof SigninPage> = {
  render: () => (
    <main className="mx-auto mobile:max-w-[336px] pc:max-w-[1100px] mb-10">
      <SigninPage />
    </main>
  ),
  parameters: {
    docs: {
      description: {
        story: '소셜 로그인을 통한 간편 로그인 페이지입니다.',
      },
    },
  },
};

// Signup Page Story
export const Signup: StoryObj<typeof SignupPage> = {
  render: () => (
    <main className="w-full mx-auto mobile:max-w-[336px] pc:max-w-[1100px] mb-10">
      <SignupPage />
    </main>
  ),
  parameters: {
    docs: {
      description: {
        story: '4단계로 구성된 회원가입 페이지입니다. (약관동의 → 회원정보 → 관심직무 → 가입완료)',
      },
    },
  },
};
