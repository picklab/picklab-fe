import { Meta, StoryObj } from '@storybook/react';
import ArchivePage from '@/app/(home)/profile/archive/page';

const meta: Meta = {
  title: 'Pages/Profile/Archive',
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'white',
      values: [{ name: 'white', value: '#ffffff' }],
    },
  },
};

export default meta;

export const Default: StoryObj<typeof ArchivePage> = {
  render: () => (
    <main className="mx-auto pc:max-w-[1100px] mobile:max-w-[335px] mb-10">
      <ArchivePage />
    </main>
  ),
  parameters: {
    docs: {
      description: {
        story: '아카이브 페이지입니다. (반응형)',
      },
    },
  },
};
