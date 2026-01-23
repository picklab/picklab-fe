'use client';

import Button from '@/components/common/Button/Button';
import TextBox from '@/components/common/Field/TextBox';
import Avatar from '@/components/common/GNB/pc/Avatar';
import Typography from '@/components/common/Typography';
import { useState } from 'react';

const ProfileSection = () => {
  const [editMode, setEditMode] = useState(false);

  const profileFields = [
    { label: '이름', value: '홍길동' },
    { label: '닉네임', value: '가나다라마바사' },
    { label: '최종학력', value: '한국대학교 한국학과' },
    { label: '생년월일', value: '0000.00.00' },
  ];

  return (
    <section className="flex flex-col items-center pb-7 border-b border-gray-20 pc:rounded-[10px] pc:border pc:border-gray-30 pc:px-[58px] pc:pb-[45px] pc:pt-[20px]">
      <div className="flex flex-col items-center gap-6 pc:gap-9 w-[335px] pc:w-[420px]">
        <div className="w-full flex flex-col items-center gap-4">
          <Avatar scale="lg" className="w-[100px] h-[100px] pb-1" />
          {profileFields.map((field) => (
            <div key={field.label} className="w-full flex flex-col gap-1">
              <Typography type="Body3Medium" className="text-gray-50">
                {field.label}
              </Typography>
              <TextBox placeholder={field.value} disabled={!editMode} textBoxType="input" className="w-full" />
            </div>
          ))}
        </div>
        {editMode ? (
          <div className="flex flex-row justify-center gap-[10px]">
            <Button label="취소하기" size="sm" buttonStyle="outlined" onClick={() => setEditMode(false)} />
            <Button label="등록하기" size="sm" buttonStyle="filled" onClick={() => setEditMode(false)} />
          </div>
        ) : (
          <Button label="수정하기" size="sm" buttonStyle="outlined" onClick={() => setEditMode(true)} />
        )}
      </div>
    </section>
  );
};

export default ProfileSection;
