import { Meta, StoryObj } from '@storybook/nextjs';
import HomePage from '@/app/(home)/page';
import { MobileLayout, PcLayout } from '@/app/(home)/page';

const meta: Meta = {
  title: 'Pages/Home',
  component: HomePage,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'white',
      values: [{ name: 'white', value: '#ffffff' }],
    },
  },
};

export default meta;

export const PcVersion: StoryObj = {
  name: 'PC',
  render: () => <PcLayout className="flex" isStorybook totalPage={5} activePage={1} newActivityRequestSize={325} />,
  parameters: {
    docs: {
      description: {
        story: 'Home 페이지의 PC 버전입니다.',
      },
    },
  },
};

export const MobileVersion: StoryObj = {
  name: 'Mobile',
  render: () => <MobileLayout className="flex" />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    backgrounds: {
      default: 'white',
    },
    docs: {
      description: {
        story: 'Home 페이지의 모바일 버전입니다.',
      },
    },
  },
};
