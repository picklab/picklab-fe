import { Meta, StoryObj } from '@storybook/react';
import SearchPage from '@/app/(home)/search/[search]/page';

const meta: Meta = {
  title: 'Pages/Search',
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'white',
      values: [{ name: 'white', value: '#ffffff' }],
    },
  },
  args: {
    params: {
      search: '검색어',
    },
  },
};

export default meta;

export const Default: StoryObj<typeof SearchPage> = {
  render: (args) => (
    <main className="mx-auto pc:max-w-[1100px] mobile:max-w-[335px] mb-10">
      {/* @ts-ignore */}
      <SearchPage {...args} />
    </main>
  ),
  parameters: {
    docs: {
      description: {
        story: '검색 페이지입니다. (반응형)',
      },
    },
  },
};
