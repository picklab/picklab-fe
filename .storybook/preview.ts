import type { Preview } from '@storybook/nextjs';
import { createElement } from 'react';
import { AuthClientProvider } from '../src/contexts/AuthContext';

import '../src/app/globals.css';

const preview: Preview = {
  // 헤더·사이드 메뉴 등은 앱 루트의 AuthClientProvider가 있어야 렌더된다.
  // 로그인 상태는 스토리 args.isLogin을 따르고, 없으면 비로그인으로 둔다.
  decorators: [
    (Story, context) =>
      createElement(
        AuthClientProvider,
        { initialAuthStatus: context.args?.isLogin === true },
        createElement(Story),
      ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
  // Storybook 8의 docs.autodocs: true와 같은 설정(10에서 위치가 바뀜)
  tags: ['autodocs'],
};

export default preview;
