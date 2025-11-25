import { Meta, StoryObj } from '@storybook/react';
import ArchivePage from '@/app/(home)/profile/archive/page';
import PcProfileArchivePage from '@/app/(home)/profile/archive/_components/PcProfileArchivePage';
import MobileProfileArchivePage from '@/app/(home)/profile/archive/_components/MobileProfileArchivePage';

const meta: Meta = {
  title: 'Pages/Profile/Archive',
  component: ArchivePage,
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
  name: 'Responsive',
  parameters: {
    docs: {
      description: {
        story: 'Archive 페이지입니다. 뷰포트 애드온을 통해 PC와 모바일 화면을 확인할 수 있습니다.',
      },
    },
  },
  render: () => <ArchivePage />,
};

export const PcVersion: StoryObj<typeof PcProfileArchivePage> = {
  name: 'PC',
  render: () => <PcProfileArchivePage isStorybook />,
  parameters: {
    docs: {
      description: {
        story: 'Archive 페이지의 PC 버전입니다.',
      },
    },
  },
};

export const MobileVersion: StoryObj<typeof MobileProfileArchivePage> = {
  name: 'Mobile',
  render: () => <MobileProfileArchivePage />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    backgrounds: {
      default: 'white',
    },
    docs: {
      description: {
        story: 'Archive 페이지의 모바일 버전입니다.',
      },
    },
  },
};
