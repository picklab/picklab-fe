
import { Meta, StoryObj } from '@storybook/react';
import ArchiveDetailPage from '@/app/(home)/profile/archive/[id]/page';
import PcArchiveDetailPage from '@/app/(home)/profile/archive/[id]/_components/PcArchiveDetailPage';
import MobileArchiveDetailPage from '@/app/(home)/profile/archive/[id]/_components/MobileArchiveDetailPage';

const meta: Meta = {
  title: 'Pages/Profile/Archive/Detail',
  component: ArchiveDetailPage,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'white',
      values: [{ name: 'white', value: '#ffffff' }],
    },
  },
};

export default meta;

export const Default: StoryObj<typeof ArchiveDetailPage> = {
  name: 'Responsive',
  parameters: {
    docs: {
      description: {
        story:
          'Archive Detail 페이지입니다. 뷰포트 애드온을 통해 PC와 모바일 화면을 확인할 수 있습니다.',
      },
    },
  },
  render: () => <ArchiveDetailPage />,
};

export const PcVersion: StoryObj<typeof PcArchiveDetailPage> = {
  name: 'PC',
  render: () => <PcArchiveDetailPage isStorybook />,
  parameters: {
    docs: {
      description: {
        story: 'Archive Detail 페이지의 PC 버전입니다.',
      },
    },
  },
};

export const MobileVersion: StoryObj<typeof MobileArchiveDetailPage> = {
  name: 'Mobile',
  render: () => <MobileArchiveDetailPage />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    backgrounds: {
      default: 'white',
    },
    docs: {
      description: {
        story: 'Archive Detail 페이지의 모바일 버전입니다.',
      },
    },
  },
};
