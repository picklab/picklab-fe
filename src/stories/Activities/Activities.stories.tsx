import { Meta, StoryObj } from '@storybook/react';
import ActivitiesPage from '@/app/(home)/activities/page';
import PcActivites from '@/app/(home)/activities/_components/PcActivites';
import MobileActivites from '@/app/(home)/activities/_components/MobileActivites';

const meta: Meta = {
  title: 'Pages/Activities',
  component: ActivitiesPage,
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
  name: 'Responsive',
  parameters: {
    docs: {
      description: {
        story: '대외활동 페이지입니다. 뷰포트 애드온을 통해 PC와 모바일 화면을 확인할 수 있습니다.',
      },
    },
  },
  render: () => <ActivitiesPage />,
};

export const PcVersion: StoryObj<typeof PcActivites> = {
  name: 'PC',
  render: () => <PcActivites isStorybook />,
  parameters: {
    docs: {
      description: {
        story: '대외활동 페이지의 PC 버전입니다.',
      },
    },
  },
};

export const MobileVersion: StoryObj<typeof MobileActivites> = {
  name: 'Mobile',
  render: () => <MobileActivites />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    backgrounds: {
      default: 'white',
    },
    docs: {
      description: {
        story: '대외활동 페이지의 모바일 버전입니다.',
      },
    },
  },
};
