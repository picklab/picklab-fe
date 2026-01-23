'use client';

import CustomModal from '@/components/common/Modal/CustomModal';

export interface LeaveConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

const LeaveConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = '지금 나가시면 내용이 사라져요!',
  description = '저장하지 않은 내용은 삭제됩니다.',
}: LeaveConfirmModalProps) => {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose} onSuccess={onConfirm} title={title} description={description} />
  );
};

export default LeaveConfirmModal;
