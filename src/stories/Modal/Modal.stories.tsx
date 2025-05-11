import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import Button from '@/components/common/Button/Button';
import Modal from '@/components/common/Modal/Modal';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal/Modal',
  args: {
    title: '모달 제목',
    description: '모달 설명입니다.',
  },
  argTypes: {
    isOpen: { table: { disable: true } },
    onClose: { table: { disable: true } },
    onSuccess: { table: { disable: true } },
  },
  component: Modal,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Modal>;

interface ModalWithStateProps {
  title: string;
  description: string;
}

const ModalWithState = ({ title, description }: ModalWithStateProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const handleSuccess = () => {
    alert('확인 버튼 클릭');
    setIsOpen(false);
  };

  return (
    <div className="flex h-[300px] items-center justify-center">
      <Button onClick={handleOpen} label="모달 열기" size="base" buttonStyle="filled" />
      <Modal isOpen={isOpen} onClose={handleClose} onSuccess={handleSuccess} title={title} description={description} />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <ModalWithState {...args} />,
};
