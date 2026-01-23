'use client';

import CustomModal from '@/components/common/Modal/CustomModal';
import TextField from '@/components/common/Field/TextField';
import { useState } from 'react';

export interface UrlAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (url: string) => void;
  title?: string;
  description?: string;
}

const UrlAddModal = ({
  isOpen,
  onClose,
  onSubmit,
  title = 'URL 추가',
  description = '추가할 URL을 입력해 주세요.',
}: UrlAddModalProps) => {
  const [url, setUrl] = useState('');

  const handleSuccess = () => {
    onSubmit(url.trim());
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} onSuccess={handleSuccess} title={title} description={description}>
      <div className="w-full mt-space-8">
        <TextField
          id="archive-url-input"
          label="URL"
          labelStatus="default"
          status="default"
          placeholder="https://example.com"
          className="w-[312px]"
          value={url}
          onChange={(e) => setUrl((e.target as HTMLInputElement).value)}
        />
      </div>
    </CustomModal>
  );
};

export default UrlAddModal;
