import { Meta, StoryObj } from '@storybook/react';
import ActivitiesPage from '@/app/(home)/activities/page';

const meta: Meta = {
  title: 'Pages/Activities',
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'white',
      values: [{ name: 'white', value: '#ffffff' }],
    },
  },
};

export default meta;

export const Default: StoryObj<typeof ActivitiesPage> = {
  render: () => (
    <main className="mx-auto pc:max-w-[1100px] mobile:max-w-[335px] mb-10">
      <ActivitiesPage />
    </main>
  ),
  parameters: {
    docs: {
      description: {
        story: '대외활동 페이지입니다. (반응형)',
      },
    },
  },
};
