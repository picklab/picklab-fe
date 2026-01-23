import CardJobChip from '@/components/common/Card/CardJobChip';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof CardJobChip> = {
  title: 'components/Card/CardJobChip',
  component: CardJobChip,
  tags: ['autodocs'],
  argTypes: {
    job: {
      control: {
        type: 'select',
        options: ['기획', '개발', '마케팅', '디자인', 'AI'],
      },
      defaultValue: '기획',
    },
    className: {
      control: {
        disable: true,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CardJobChip>;

export const Playground: Story = {
  args: {
    job: '기획',
    className: '',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-2">
      <CardJobChip job="기획" />
      <CardJobChip job="개발" />
      <CardJobChip job="마케팅" />
      <CardJobChip job="디자인" />
      <CardJobChip job="AI" />
    </div>
  ),
};
