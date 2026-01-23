import { Meta, StoryObj } from '@storybook/react';
import SearchPage from '@/app/(home)/search/[search]/page';
import PcSearchPage from '@/app/(home)/search/_components/PcSearchPage';
import MobileSearchPage from '@/app/(home)/search/_components/MobileSearchPage';

const meta: Meta = {
  title: 'Pages/Search',
  component: SearchPage,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'white',
      values: [{ name: 'white', value: '#ffffff' }],
    },
  },
};

export default meta;

export const Default: StoryObj<typeof SearchPage> = {
  name: 'Responsive',
  parameters: {
    docs: {
      description: {
        story: 'Search 페이지입니다. 뷰포트 애드온을 통해 PC와 모바일 화면을 확인할 수 있습니다.',
      },
    },
  },
  render: () => <SearchPage params={{ search: '검색어' }} />,
};

export const PcVersion: StoryObj<typeof PcSearchPage> = {
  name: 'PC',
  render: () => <PcSearchPage search="검색어" isStorybook />,
  parameters: {
    docs: {
      description: {
        story: 'Search 페이지의 PC 버전입니다.',
      },
    },
  },
};

export const MobileVersion: StoryObj<typeof MobileSearchPage> = {
  name: 'Mobile',
  render: () => <MobileSearchPage search="검색어" />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    backgrounds: {
      default: 'white',
    },
    docs: {
      description: {
        story: 'Search 페이지의 모바일 버전입니다.',
      },
    },
  },
};
