import { Meta, StoryObj } from '@storybook/react';
import HomePage from '@/app/(home)/page';

const meta: Meta = {
  title: 'Pages/Home',
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'white',
      values: [{ name: 'white', value: '#ffffff' }],
    },
  },
};

export default meta;

// Home Page Story - 반응형 (모바일/PC 모두 포함)
export const Default: StoryObj<typeof HomePage> = {
  render: () => (
    <main className="mx-auto pc:max-w-[1100px] mobile:max-w-[335px] mb-10">
      <HomePage />
    </main>
  ),
  parameters: {
    docs: {
      description: {
        story: '홈 페이지입니다. 배너, 추천 활동, 인기 대외활동, 최근 본 활동 등을 보여줍니다. (반응형)',
      },
    },
  },
};
