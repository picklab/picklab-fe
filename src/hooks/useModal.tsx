import { useRouter } from 'next/navigation';

const useModal = () => {
  const router = useRouter();

  const openDefaultModal = () => {
    router.push('/default-modal');
  };

  const closeModal = () => {
    router.back();
  };
  return { openDefaultModal, closeModal };
};

export default useModal;
