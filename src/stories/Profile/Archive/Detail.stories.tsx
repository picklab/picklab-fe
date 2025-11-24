import { Meta, StoryObj } from '@storybook/react';
import ArchiveDetailPage from '@/app/(home)/profile/archive/[id]/page';

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

export const Detail: StoryObj<typeof ArchiveDetailPage> = {
  render: () => (
    <main className="mx-auto pc:max-w-[1100px] mobile:max-w-[335px] mb-10">
      <ArchiveDetailPage />
    </main>
  ),
  parameters: {
    docs: {
      description: {
        story: '아카이브 상세 페이지입니다. (반응형)',
      },
    },
  },
};
