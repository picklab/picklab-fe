import type { Preview } from '@storybook/react';
import { withRouter } from 'storybook-addon-remix-react-router';

import '../src/app/globals.css';

const preview: Preview = {
  decorators: [withRouter],
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
};

export default preview;
