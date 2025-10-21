'use client';

import Button from '@/components/common/Button/Button';
import TextField from '@/components/common/Field/TextField';
import CustomModal from '@/components/common/Modal/CustomModal';
import useModal from '@/hooks/useModal';

export default function Page() {
  const { closeModal } = useModal();
  return (
    <CustomModal
      isOpen={true}
      onClose={closeModal}
      onSuccess={() => console.log('success')}
      title="이메일 변경"
      width={532}
      backdropClose={false}
    >
      <div className="flex flex-col w-full gap-5">
        <div className="flex flex-row gap-[7px] items-center w-full h-[104px]">
          <TextField
            id="email-verification"
            labelStatus="default"
            status="disabled"
            label="이메일 인증"
            placeholder="이메일을 입력해주세요"
          />
          <Button label="인증요청" size="lg" buttonStyle="outlined" />
        </div>
      </div>

      <div className="flex flex-col w-full gap-5">
        <div className="flex flex-row gap-[7px] items-center w-full h-[104px]">
          <TextField
            id="email-verification"
            labelStatus="default"
            status="disabled"
            label="인증번호"
            placeholder="인증번호를 입력해주세요"
          />
          <Button label="확인하기" size="lg" buttonStyle="outlined" />
        </div>
      </div>
    </CustomModal>
  );
}
