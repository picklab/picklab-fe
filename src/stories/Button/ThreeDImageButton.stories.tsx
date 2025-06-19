import { Meta, StoryObj } from '@storybook/react';

import ThreeDImagePlaceHolder from '@/../public/imgs/ThreeDImagePlaceHolder.jpg';
import ThreeDImageButton from '@/components/common/Button/ThreeDImageButton';

const meta: Meta<typeof ThreeDImageButton> = {
  title: 'Components/Button/ThreeDImageButton',
  component: ThreeDImageButton,
  tags: ['autodocs'],
  args: {
    isActive: false,
  },
  argTypes: {
    isActive: { control: 'boolean' },
    text: { control: 'text' },
    imgSrc: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof ThreeDImageButton>;

export const Default: Story = {
  args: {
    isActive: false,
    text: 'text',
    imgSrc: ThreeDImagePlaceHolder.src,
  },
};

export const Active: Story = {
  args: {
    isActive: true,
    text: 'text',
    imgSrc: ThreeDImagePlaceHolder.src,
  },
};

export const WithCustomImage: Story = {
  args: {
    isActive: false,
    text: 'text',
    imgSrc: 'https://placehold.co/600x400', // 외부 이미지 테스트
  },
};
