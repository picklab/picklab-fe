'use client';

import Modal from '@/components/common/Modal/Modal';
import useModal from '@/hooks/useModal';

export default function Page() {
  const { closeModal } = useModal();
  return (
    <Modal
      isOpen={true}
      onClose={closeModal}
      onSuccess={closeModal}
      title="title"
      description="description"
    />
  );
}
