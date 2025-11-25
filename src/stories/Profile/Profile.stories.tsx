import { Meta, StoryObj } from '@storybook/react';
import ProfilePage from '@/app/(home)/profile/page';
import PcProfilePage from '@/app/(home)/profile/_components/PcProfilePage';
import MobileProfilePage from '@/app/(home)/profile/_components/MobileProfilePage';

const meta: Meta = {
  title: 'Pages/Profile',
  component: ProfilePage,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'white',
      values: [{ name: 'white', value: '#ffffff' }],
    },
  },
};

export default meta;

export const Default: StoryObj<typeof ProfilePage> = {
  name: 'Responsive',
  parameters: {
    docs: {
      description: {
        story: 'Profile 페이지입니다. 뷰포트 애드온을 통해 PC와 모바일 화면을 확인할 수 있습니다.',
      },
    },
  },
  render: () => <ProfilePage />,
};

export const PcVersion: StoryObj<typeof PcProfilePage> = {
  name: 'PC',
  render: () => <PcProfilePage isStorybook />,
  parameters: {
    docs: {
      description: {
        story: 'Profile 페이지의 PC 버전입니다.',
      },
    },
  },
};

export const MobileVersion: StoryObj<typeof MobileProfilePage> = {
  name: 'Mobile',
  render: () => <MobileProfilePage />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    backgrounds: {
      default: 'white',
    },
    docs: {
      description: {
        story: 'Profile 페이지의 모바일 버전입니다.',
      },
    },
  },
};
