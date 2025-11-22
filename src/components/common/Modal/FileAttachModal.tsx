'use client';

import CustomModal from '@/components/common/Modal/CustomModal';
import Typography from '@/components/common/Typography';
import { useState } from 'react';

export interface FileAttachModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (files: File[]) => void;
  title?: string;
  description?: string;
  multiple?: boolean;
}

const FileAttachModal = ({
  isOpen,
  onClose,
  onSubmit,
  multiple = true,
  title = '파일 첨부',
  description = '첨부할 파일을 선택해 주세요.',
}: FileAttachModalProps) => {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
  };

  const handleSuccess = () => {
    onSubmit(files);
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      onSuccess={handleSuccess}
      title={title}
      description={description}
      width={420}
    >
      <div className="w-full mt-space-8 flex flex-col gap-2">
        <label htmlFor="archive-file-input">
          <Typography type="Caption1Medium" className="text-gray-90">
            파일 선택
          </Typography>
        </label>
        <input id="archive-file-input" type="file" multiple={multiple} onChange={handleFileChange} />
        {files.length > 0 && (
          <Typography type="Caption1Regular" className="text-gray-50">
            {files.length}개 파일 선택됨
          </Typography>
        )}
      </div>
    </CustomModal>
  );
};

export default FileAttachModal;
