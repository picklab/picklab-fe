import JobChip from '@/components/common/Card/JobChip';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof JobChip> = {
  title: 'components/Card/JobChip',
  component: JobChip,
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
type Story = StoryObj<typeof JobChip>;

export const Playground: Story = {
  args: {
    job: '기획',
    className: '',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-2">
      <JobChip job="기획" />
      <JobChip job="개발" />
      <JobChip job="마케팅" />
      <JobChip job="디자인" />
      <JobChip job="AI" />
    </div>
  ),
};
