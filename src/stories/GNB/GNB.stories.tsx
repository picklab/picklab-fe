import GNB from '@/components/common/GNB/GNB';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof GNB> = {
  title: 'Components/GNB/GNB',
  component: GNB,
  parameters: {
    layout: 'fullscreen', // centered 대신 fullscreen 사용
  },
  decorators: [
    (Story) => (
      //   <div
      //     style={{
      //       scale: 0.85,
      //       width: '1440px',
      //       maxWidth: '100%',
      //       transform: 'translateX(-260px)',
      //       overflowX: 'scroll', //  <-- 이 부분을 추가하세요.
      //       // 필요하다면 overflowY도 설정할 수 있습니다. 예: overflowY: 'hidden'
      //     }}
      //   >
      //     <Story />
      //   </div>
      <div
        style={{
          width: '300px',
          maxWidth: '300px',
          overflowX: 'scroll',
          border: '1px solid red',
        }}
      >
        <div style={{ width: '1000px', background: '#eee' }}>
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof GNB>;

export const LoggedOut: Story = {
  args: {
    isLogin: false,
  },
};

export const LoggedIn: Story = {
  args: {
    isLogin: true,
  },
};
