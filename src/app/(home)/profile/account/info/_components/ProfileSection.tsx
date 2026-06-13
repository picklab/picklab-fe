'use client';

import Button from '@/components/common/Button/Button';
import TextBox from '@/components/common/Field/TextBox';
import Icon from '@/components/common/Icon/Icon';
import Typography from '@/components/common/Typography';
import { useEffect, useMemo, useRef, useState } from 'react';

type ProfileForm = {
  name: string;
  nickname: string;
  education: string;
  birthDate: string;
};

type MemberInfoPayload = {
  school: string;
  graduationStatus: string;
  employmentStatus: string;
  company: string;
  employmentType: 'NONE' | 'FULL_TIME' | 'CONTRACT' | 'INTERN' | 'PART_TIME';
};

function readErrorMessage(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== 'object') return fallback;
  if ('message' in payload && typeof payload.message === 'string') return payload.message;
  if ('error' in payload && typeof payload.error === 'string') return payload.error;
  return fallback;
}

function unwrapData(payload: unknown): unknown {
  if (!payload || typeof payload !== 'object') return payload;
  const record = payload as Record<string, unknown>;
  if ('data' in record) return record.data;
  if ('result' in record) return record.result;
  return payload;
}

function extractSocialProviders(raw: unknown): string[] {
  const data = unwrapData(raw);
  if (!data || typeof data !== 'object') return [];

  if (Array.isArray(data)) {
    return data.filter((item): item is string => typeof item === 'string');
  }

  const record = data as Record<string, unknown>;
  const candidateArrays: Array<keyof typeof record> = ['socialLogins', 'providers', 'items'];
  for (const key of candidateArrays) {
    const value = record[key];
    if (Array.isArray(value)) {
      return value.filter((item: unknown): item is string => typeof item === 'string');
    }
  }

  const enabledProviders = Object.entries(record)
    .filter(([, value]) => value === true)
    .map(([key]) => key);

  return enabledProviders;
}

function readString(record: Record<string, unknown>, ...keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string') return value;
  }
  return '';
}

function normalizeEmploymentType(value: unknown): MemberInfoPayload['employmentType'] {
  const allowedTypes: MemberInfoPayload['employmentType'][] = ['NONE', 'FULL_TIME', 'CONTRACT', 'INTERN', 'PART_TIME'];
  return allowedTypes.includes(value as MemberInfoPayload['employmentType'])
    ? (value as MemberInfoPayload['employmentType'])
    : 'NONE';
}

function parseMemberInfo(payload: unknown, fallbackForm: ProfileForm, fallbackExtra: MemberInfoPayload) {
  const data = unwrapData(payload);
  if (!data || typeof data !== 'object') return { form: fallbackForm, extra: fallbackExtra };

  const record = data as Record<string, unknown>;
  const employment = record.employment && typeof record.employment === 'object'
    ? (record.employment as Record<string, unknown>)
    : {};

  return {
    form: {
      name: readString(record, 'name') || fallbackForm.name,
      nickname: readString(record, 'nickname', 'nick_name') || fallbackForm.nickname,
      education: readString(record, 'education_level', 'educationLevel') || fallbackForm.education,
      birthDate: readString(record, 'birth_date', 'birthDate') || fallbackForm.birthDate,
    },
    extra: {
      school: readString(record, 'school') || fallbackExtra.school,
      graduationStatus: readString(record, 'graduation_status', 'graduationStatus') || fallbackExtra.graduationStatus,
      employmentStatus:
        readString(record, 'employment_status', 'employmentStatus') ||
        readString(employment, 'employment_status', 'employmentStatus') ||
        fallbackExtra.employmentStatus,
      company: readString(record, 'company') || readString(employment, 'company') || fallbackExtra.company,
      employmentType: normalizeEmploymentType(record.employment_type ?? record.employmentType ?? fallbackExtra.employmentType),
    },
  };
}

type PresignedUploadInfo = {
  uploadUrl: string;
  imageUrl?: string;
};

function parsePresignedUploadInfo(payload: unknown): PresignedUploadInfo | null {
  const candidates: unknown[] = [payload, unwrapData(payload)];

  for (const item of candidates) {
    if (!item || typeof item !== 'object') continue;
    const record = item as Record<string, unknown>;

    const uploadUrlCandidate =
      (typeof record.uploadUrl === 'string' && record.uploadUrl) ||
      (typeof record.presignedUrl === 'string' && record.presignedUrl) ||
      (typeof record.presigned_url === 'string' && record.presigned_url) ||
      (typeof record.putUrl === 'string' && record.putUrl) ||
      (typeof record.url === 'string' && record.url);

    if (!uploadUrlCandidate) continue;

    const imageUrlCandidate =
      (typeof record.imageUrl === 'string' && record.imageUrl) ||
      (typeof record.fileUrl === 'string' && record.fileUrl) ||
      (typeof record.publicUrl === 'string' && record.publicUrl) ||
      (typeof record.downloadUrl === 'string' && record.downloadUrl) ||
      undefined;

    return {
      uploadUrl: uploadUrlCandidate,
      imageUrl: imageUrlCandidate,
    };
  }

  return null;
}

const ProfileSection = () => {
  const defaultForm: ProfileForm = {
    name: '홍길동',
    nickname: '가나다라마바사',
    education: '한국대학교 한국학과',
    birthDate: '0000.00.00',
  };
  const defaultMemberInfo: MemberInfoPayload = {
    school: '한국대학교',
    graduationStatus: '졸업',
    employmentStatus: '해당 없음',
    company: '',
    employmentType: 'NONE',
  };
  const [editMode, setEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingSocialLogins, setIsLoadingSocialLogins] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [socialProviders, setSocialProviders] = useState<string[]>([]);
  const [avatarSrc, setAvatarSrc] = useState('/imgs/avatar.jpg');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const createdObjectUrlRef = useRef<string | null>(null);
  // 프로필 사진 등록 팝업(2532-26124): 드롭존에서 선택 후 "등록하기"로 업로드
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [savedForm, setSavedForm] = useState<ProfileForm>(defaultForm);
  const [form, setForm] = useState<ProfileForm>(defaultForm);
  const [memberInfo, setMemberInfo] = useState<MemberInfoPayload>(defaultMemberInfo);

  useEffect(() => {
    const fetchSocialLogins = async () => {
      try {
        setIsLoadingSocialLogins(true);
        const response = await fetch('/api/members/social-logins');
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) return;
        setSocialProviders(extractSocialProviders(payload));
      } catch (error) {
        console.error('소셜 로그인 정보 로딩 중 오류 발생:', error);
      } finally {
        setIsLoadingSocialLogins(false);
      }
    };

    fetchSocialLogins();
  }, []);

  useEffect(() => {
    const fetchMemberInfo = async () => {
      try {
        const response = await fetch('/api/members/me');
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) return;

        const { form: nextForm, extra: nextMemberInfo } = parseMemberInfo(payload, defaultForm, defaultMemberInfo);
        setSavedForm(nextForm);
        setForm(nextForm);
        setMemberInfo(nextMemberInfo);
      } catch (error) {
        console.error('회원 정보 로딩 중 오류 발생:', error);
      }
    };

    fetchMemberInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (createdObjectUrlRef.current) {
        URL.revokeObjectURL(createdObjectUrlRef.current);
      }
    };
  }, []);

  const socialLoginText = useMemo(() => {
    if (isLoadingSocialLogins) return '연동 정보 불러오는 중...';
    if (socialProviders.length === 0) return '연동된 소셜 로그인이 없습니다.';
    return socialProviders.join(', ');
  }, [isLoadingSocialLogins, socialProviders]);

  const updateField = (key: keyof ProfileForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCancel = () => {
    setForm(savedForm);
    setEditMode(false);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/members/info', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          nickname: form.nickname,
          education_level: form.education,
          school: memberInfo.school,
          graduation_status: memberInfo.graduationStatus,
          employment_status: memberInfo.employmentStatus,
          company: memberInfo.company,
          employment_type: memberInfo.employmentType,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        window.alert(readErrorMessage(payload, '프로필 정보 저장에 실패했습니다.'));
        return;
      }

      setSavedForm(form);
      setEditMode(false);
      window.alert('프로필 정보가 저장되었습니다.');
    } catch (error) {
      console.error('프로필 정보 저장 중 오류 발생:', error);
      window.alert('프로필 정보 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 카메라 버튼 → 프로필 사진 등록 팝업 오픈
  const handleAvatarClick = () => {
    if (selectedPreview) URL.revokeObjectURL(selectedPreview);
    setSelectedFile(null);
    setSelectedPreview(null);
    setIsPhotoModalOpen(true);
  };

  const closePhotoModal = () => {
    if (selectedPreview) URL.revokeObjectURL(selectedPreview);
    setSelectedFile(null);
    setSelectedPreview(null);
    setIsPhotoModalOpen(false);
  };

  // 드롭존/파일선택에서 호출 — 업로드는 "등록하기"에서
  const pickFile = (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      window.alert('이미지 파일만 업로드할 수 있습니다.');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      window.alert('50MB 이하의 파일만 등록할 수 있습니다.');
      return;
    }
    if (selectedPreview) URL.revokeObjectURL(selectedPreview);
    setSelectedFile(file);
    setSelectedPreview(URL.createObjectURL(file));
  };

  const handleModalFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    pickFile(event.target.files?.[0]);
    event.target.value = '';
  };

  const handleDropZoneDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    pickFile(event.dataTransfer.files?.[0]);
  };

  const handleRegisterPhoto = async () => {
    if (!selectedFile) {
      window.alert('등록할 이미지를 선택해주세요.');
      return;
    }
    const ok = await uploadProfileImage(selectedFile);
    if (ok) closePhotoModal();
  };

  const uploadProfileImage = async (file: File): Promise<boolean> => {
    const previousAvatarSrc = avatarSrc;
    const previewUrl = URL.createObjectURL(file);
    createdObjectUrlRef.current = previewUrl;
    setAvatarSrc(previewUrl);

    try {
      setIsUploadingImage(true);

      const presignedResponse = await fetch('/api/files/presigned-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file_name: file.name,
          category: 'PROFILE',
          file_size: file.size,
        }),
      });

      const presignedPayload = await presignedResponse.json().catch(() => ({}));
      if (!presignedResponse.ok) {
        window.alert(readErrorMessage(presignedPayload, '이미지 업로드 URL 발급에 실패했습니다.'));
        setAvatarSrc(previousAvatarSrc);
        return false;
      }

      const presignedInfo = parsePresignedUploadInfo(presignedPayload);
      if (!presignedInfo) {
        window.alert('업로드 URL 정보를 해석할 수 없습니다.');
        setAvatarSrc(previousAvatarSrc);
        return false;
      }

      const uploadResponse = await fetch(presignedInfo.uploadUrl, {
        method: 'PUT',
        headers: file.type ? { 'Content-Type': file.type } : undefined,
        body: file,
      });

      if (!uploadResponse.ok) {
        window.alert('이미지 업로드에 실패했습니다.');
        setAvatarSrc(previousAvatarSrc);
        return false;
      }

      const imageUrl = presignedInfo.imageUrl || presignedInfo.uploadUrl.split('?')[0];
      const updateResponse = await fetch('/api/members/profile-image', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profile_image: imageUrl }),
      });

      const updatePayload = await updateResponse.json().catch(() => ({}));
      if (!updateResponse.ok) {
        window.alert(readErrorMessage(updatePayload, '프로필 이미지 저장에 실패했습니다.'));
        setAvatarSrc(previousAvatarSrc);
        return false;
      }

      window.alert('프로필 이미지가 저장되었습니다.');
      return true;
    } catch (error) {
      console.error('프로필 이미지 업로드 중 오류 발생:', error);
      window.alert('프로필 이미지 업로드 중 오류가 발생했습니다.');
      setAvatarSrc(previousAvatarSrc);
      return false;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const profileFields: Array<{ label: string; key: keyof ProfileForm; placeholder: string }> = [
    { label: '이름', key: 'name', placeholder: '이름을 입력해주세요.' },
    { label: '닉네임', key: 'nickname', placeholder: '닉네임을 입력해주세요.' },
    { label: '최종학력', key: 'education', placeholder: '최종학력을 입력해주세요.' },
    { label: '생년월일', key: 'birthDate', placeholder: '예: 2000.01.01' },
  ];

  return (
    <>
    <section className="flex flex-col items-center pb-7 border-b border-gray-20 pc:rounded-[10px] pc:border pc:border-gray-30 pc:px-[58px] pc:pb-[45px] pc:pt-[20px]">
      <div className="flex flex-col items-center gap-6 pc:gap-9 w-[335px] pc:w-[420px]">
        <div className="w-full flex flex-col items-center gap-4">
          <div className="relative w-[100px] h-[100px]">
            <div className="w-full h-full rounded-full border border-gray-30 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={avatarSrc} alt="프로필 이미지" className="w-full h-full object-cover" />
            </div>
            <button
              type="button"
              className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 w-8 h-8 rounded-full border border-gray-30 bg-gray-0 flex items-center justify-center shadow-sm"
              onClick={handleAvatarClick}
              disabled={isUploadingImage}
              aria-label="프로필 이미지 변경"
            >
              <Icon icon="camera" size={16} className="text-gray-70" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleModalFileInput}
              disabled={isUploadingImage}
            />
          </div>
          {isUploadingImage && (
            <Typography type="Body4Medium" className="text-gray-50">
              이미지 업로드 중...
            </Typography>
          )}
          <div className="w-full flex flex-col items-center gap-1">
            <Typography type="Body4Medium" className="text-gray-50">
              연동 소셜 로그인
            </Typography>
            <Typography type="Body3Medium" className="text-gray-70">
              {socialLoginText}
            </Typography>
          </div>
          {profileFields.map((field) => (
            <div key={field.label} className="w-full flex flex-col gap-1">
              <Typography type="Body3Medium" className="text-gray-50">
                {field.label}
              </Typography>
              <TextBox
                placeholder={field.placeholder}
                disabled={!editMode}
                textBoxType="input"
                className="w-full"
                value={form[field.key]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField(field.key, e.target.value)}
              />
            </div>
          ))}
        </div>
        {editMode ? (
          <div className="flex flex-row justify-center gap-[10px]">
            <Button label="취소하기" size="sm" buttonStyle="outlined" onClick={handleCancel} disabled={isSubmitting} />
            <Button
              label={isSubmitting ? '저장 중...' : '등록하기'}
              size="sm"
              buttonStyle="filled"
              onClick={handleSubmit}
              disabled={isSubmitting}
            />
          </div>
        ) : (
          <Button label="수정하기" size="sm" buttonStyle="outlined" onClick={() => setEditMode(true)} />
        )}
      </div>
    </section>

      {/* 프로필 사진 등록 팝업 (2532-26124) */}
      {isPhotoModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="프로필 사진 등록"
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-90/50 px-5"
          onClick={closePhotoModal}
        >
          <div
            className="relative w-full max-w-[560px] rounded-[16px] bg-gray-0 px-8 py-7"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <Typography type="Heading1Bold" className="text-gray-90">
                프로필 사진 등록
              </Typography>
              <button type="button" aria-label="닫기" onClick={closePhotoModal}>
                <Icon icon="xMark" size={24} className="text-gray-90" />
              </button>
            </div>

            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDropZoneDrop}
              className="mt-6 flex min-h-[260px] cursor-pointer flex-col items-center justify-center gap-3 rounded-[8px] border border-dashed border-gray-40 px-4 text-center"
            >
              {selectedPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selectedPreview}
                  alt="선택한 이미지 미리보기"
                  className="max-h-[200px] rounded-[8px] object-contain"
                />
              ) : (
                <>
                  <Typography type="Body1Semibold" className="text-gray-90">
                    이 영역에 파일을 끌어 놓거나 붙여넣으세요.
                  </Typography>
                  <Typography type="Body3Medium" className="text-gray-50">
                    이미지 파일(.jpg .gif .png .psd .ai .jpeg .tif .tiff) 업로드 가능
                  </Typography>
                  <Typography type="Body3Medium" className="text-gray-50">
                    *파일은 50MB 이하의 파일을 등록할 수 있습니다.
                  </Typography>
                </>
              )}
            </div>

            <div className="mt-6 flex justify-center gap-3">
              <Button
                label="취소하기"
                size="sm"
                buttonStyle="outlined"
                onClick={closePhotoModal}
                disabled={isUploadingImage}
              />
              <Button
                label="등록하기"
                size="sm"
                buttonStyle="filled"
                onClick={handleRegisterPhoto}
                disabled={isUploadingImage || !selectedFile}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileSection;
