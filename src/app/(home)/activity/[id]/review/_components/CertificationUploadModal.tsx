'use client';

import { useRef, useState } from 'react';
import clsx from 'clsx';
import Typography from '@/components/common/Typography';
import { ModalShell } from './ReviewWriteShared';

interface CertificationUploadModalProps {
  submitting: boolean;
  validateFile: (file: File) => string | null;
  onPrev: () => void;
  onClose: () => void;
  /** 선택 파일을 받아 업로드 후 리뷰 등록까지 진행. */
  onRegister: (file: File) => void;
}

export default function CertificationUploadModal({
  submitting,
  validateFile,
  onPrev,
  onClose,
  onRegister,
}: CertificationUploadModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleSelect = (selected: File | null) => {
    if (!selected) return;
    const validationError = validateFile(selected);
    if (validationError) {
      setError(validationError);
      setFile(null);
      return;
    }
    setError(null);
    setFile(selected);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleSelect(e.dataTransfer.files?.[0] ?? null);
  };

  const handleRegister = () => {
    if (!file) {
      setError('인증자료 파일을 업로드해주세요.');
      return;
    }
    onRegister(file);
  };

  return (
    <ModalShell title="인증자료 업로드" onClose={onClose} className="w-full max-w-[520px]">
      <div className="flex flex-col gap-4 px-space-24 pb-space-24 pt-space-12">
        <Typography type="Body3Regular" className="text-gray-50">
          활동 합격, 참여를 증명 가능한 합격 메일 또는 수료증을 업로드해 주세요.
        </Typography>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={clsx(
            'flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-10 text-center',
            dragging ? 'border-primary-50 bg-primary-5' : 'border-gray-30 bg-gray-5',
          )}
        >
          <Typography type="Body3Medium" className="text-gray-70">
            이 영역에 파일을 끌어 놓거나 붙여넣으세요.
          </Typography>
          <Typography type="Body4Regular" className="text-gray-50">
            이미지 파일(.jpg .gif .png .psd .ai .jpeg .tif .tiff) 업로드 가능
          </Typography>
          <Typography type="Body4Regular" className="text-gray-50">
            *파일은 50MB 이하의 파일을 등록할 수 있습니다.
          </Typography>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-2 underline underline-offset-2"
          >
            <Typography type="Body3Medium" className="text-primary-60">
              내 기기에서 찾기
            </Typography>
          </button>
          <input
            ref={inputRef}
            type="file"
            accept=".jpg,.gif,.png,.psd,.ai,.jpeg,.tif,.tiff"
            className="hidden"
            onChange={(e) => handleSelect(e.target.files?.[0] ?? null)}
          />
          {file && (
            <Typography type="Body4Medium" className="mt-2 text-gray-90">
              {file.name}
            </Typography>
          )}
        </div>

        {error && (
          <Typography type="Body4Regular" className="text-danger-50">
            {error}
          </Typography>
        )}

        <div className="flex flex-col gap-1">
          <Typography type="Body4Regular" className="text-danger-50">
            개인정보 보호를 위해 주민등록번호 등 민감한 정보는 가려서 제출해 주세요.
          </Typography>
          <Typography type="Body4Regular" className="text-danger-50">
            제출된 자료는 리뷰 인증을 위한 용도로만 사용되며, 다른 목적으로 활용되지 않습니다.
          </Typography>
        </div>

        <div className="flex gap-2">
          {/* 모바일: [리뷰 등록] 하나만 / PC: [이전으로] + [리뷰 등록] */}
          <button
            type="button"
            onClick={onPrev}
            disabled={submitting}
            className="hidden h-space-48 w-full rounded-small bg-gray-5 hover:bg-gray-10 disabled:opacity-60 pc:block"
          >
            <Typography type="Body2Medium" className="text-gray-90">
              이전으로
            </Typography>
          </button>
          <button
            type="button"
            onClick={handleRegister}
            disabled={submitting}
            className="h-space-48 w-full rounded-small bg-primary-50 hover:bg-primary-60 disabled:bg-gray-10 pc:w-auto pc:flex-1"
          >
            <Typography type="Body2Medium" className="text-gray-0">
              {submitting ? '등록 중...' : '리뷰 등록'}
            </Typography>
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
