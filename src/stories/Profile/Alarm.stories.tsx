import { Meta, StoryObj } from '@storybook/react';
import AlarmPage from '@/app/(home)/profile/alarm/page';

const meta: Meta = {
  title: 'Pages/Profile/Alarm',
  component: AlarmPage,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'white',
      values: [{ name: 'white', value: '#ffffff' }],
    },
  },
};

export default meta;

export const Default: StoryObj<typeof AlarmPage> = {
  name: 'PC Only',
  render: () => <AlarmPage isStorybook />,
  parameters: {
    docs: {
      description: {
        story: '알림 관리 페이지입니다. 현재 PC 버전만 존재합니다.',
      },
    },
  },
};
