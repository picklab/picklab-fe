import { StepType } from '@/components/common/Funnel/FunnelStep';
import SignupFunnel from '@/components/common/Funnel/SignupFunnel';

import type { Meta, StoryObj } from '@storybook/react';

const steps: StepType[] = [
  { label: '회원정보', icon: 'human' },
  { label: '관심직무', icon: 'search' },
  { label: '가입완료', icon: 'check' },
];

const meta: Meta<typeof SignupFunnel> = {
  title: 'components/Funnel/SignupFunnel',
  component: SignupFunnel,
  tags: ['autodocs'],
  argTypes: {
    currentStep: {
      control: { type: 'number', min: 1, max: steps.length, step: 1 },
    },
    steps: {
      control: { disable: true },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SignupFunnel>;

export const Playground: Story = {
  args: {
    currentStep: 1,
    steps,
  },
};

export const AllSteps: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {[1, 2, 3].map((step) => (
        <SignupFunnel key={step} steps={steps} currentStep={step} />
      ))}
    </div>
  ),
};
