'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ActivityCardItem } from '@/app/(home)/_components/constant';
import {
  JOB_DETAIL_BY_GROUP,
  type MyReviewDetail,
  type ReviewJobDetail,
  type ReviewJobGroup,
  type ReviewProgressStatus,
  type ReviewUpdatePayload,
} from '@/types/review.types';
import { updateReview } from '@/hooks/useMyReviews';

export type ReviewStep = 1 | 2 | 3;

/** 폼 동작 모드: 신규 작성(create) / 기존 리뷰 수정(edit). */
export type ReviewFormMode = 'create' | 'edit';

/** 인증자료 업로드 가능한 이미지 확장자 (디자인 명세 기준). 백엔드 검증 정책 확인 필요. */
export const ALLOWED_FILE_EXTENSIONS = ['.jpg', '.gif', '.png', '.psd', '.ai', '.jpeg', '.tif', '.tiff'];
/** 최대 업로드 크기 50MB. */
export const MAX_FILE_SIZE = 50 * 1024 * 1024;

const SUMMARY_MAX = 20;
const TEXT_MIN = 30;
const TEXT_MAX = 1000;

export interface ReviewWriteState {
  jobGroup: ReviewJobGroup | '';
  jobDetail: ReviewJobDetail | '';
  progressStatus: ReviewProgressStatus | '';
  overallScore: number; // 1~5, 0 = 미선택
  infoScore: number;
  difficultyScore: number;
  benefitScore: number;
  jobRelevanceScore: number;
  summary: string;
  strength: string;
  weakness: string;
  tips: string;
}

const INITIAL_STATE: ReviewWriteState = {
  jobGroup: '',
  jobDetail: '',
  progressStatus: '',
  overallScore: 0,
  infoScore: 0,
  difficultyScore: 0,
  benefitScore: 0,
  jobRelevanceScore: 0,
  summary: '',
  strength: '',
  weakness: '',
  tips: '',
};

export interface ReviewFieldErrors {
  jobGroup?: string;
  jobDetail?: string;
  overallScore?: string;
  infoScore?: string;
  difficultyScore?: string;
  benefitScore?: string;
  jobRelevanceScore?: string;
  summary?: string;
  strength?: string;
  weakness?: string;
  tips?: string;
}

interface UseReviewWriteFormArgs {
  activity: ActivityCardItem;
  activityId: string;
  /** 'create'(기본) | 'edit'. edit는 PUT /api/reviews/{reviewId}로 제출한다. */
  mode?: ReviewFormMode;
  /** edit 모드 필수: 수정 대상 리뷰 id. */
  reviewId?: string | number;
  /** edit 모드 프리필 초기값 (MyReviewDetail → ReviewWriteState 변환분). */
  initialState?: Partial<ReviewWriteState>;
  /** edit 모드에서 새 인증자료를 올리지 않을 때 유지할 기존 인증자료 URL. */
  initialFileUrl?: string | null;
  /** 제출 성공 후 동작. 미지정 시 활동 상세로 이동(작성 기본 동작). */
  onSuccess?: () => void;
  /** "나가기" 동작. 미지정 시 활동 상세로 이동(작성 기본 동작). */
  onLeave?: () => void;
}

/** presigned 업로드 응답 파싱 (archiveRecordOptions.parsePresignedUploadInfo 로직 복제). */
function parsePresignedUploadInfo(payload: unknown): { uploadUrl: string; fileUrl?: string } | null {
  const unwrap = (p: unknown) => {
    if (!p || typeof p !== 'object') return p;
    const record = p as Record<string, unknown>;
    return record.data ?? p;
  };
  const candidates: unknown[] = [payload, unwrap(payload)];

  for (const item of candidates) {
    if (!item || typeof item !== 'object') continue;
    const record = item as Record<string, unknown>;
    const uploadUrl =
      (typeof record.uploadUrl === 'string' && record.uploadUrl) ||
      (typeof record.presignedUrl === 'string' && record.presignedUrl) ||
      (typeof record.presigned_url === 'string' && record.presigned_url) ||
      (typeof record.putUrl === 'string' && record.putUrl) ||
      (typeof record.url === 'string' && record.url);
    if (!uploadUrl) continue;
    const fileUrl =
      (typeof record.fileUrl === 'string' && record.fileUrl) ||
      (typeof record.publicUrl === 'string' && record.publicUrl) ||
      (typeof record.downloadUrl === 'string' && record.downloadUrl) ||
      undefined;
    return { uploadUrl, fileUrl };
  }
  return null;
}

function readApiErrorMessage(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== 'object') return fallback;
  const record = payload as Record<string, unknown>;
  if (typeof record.message === 'string') return record.message;
  if (typeof record.error === 'string') return record.error;
  return fallback;
}

export function useReviewWriteForm({
  activity: initialActivity,
  activityId: initialActivityId,
  mode = 'create',
  reviewId,
  initialState,
  initialFileUrl,
  onSuccess,
  onLeave,
}: UseReviewWriteFormArgs) {
  const router = useRouter();
  const [step, setStep] = useState<ReviewStep>(1);
  const [state, setState] = useState<ReviewWriteState>(() => ({ ...INITIAL_STATE, ...initialState }));
  const [errors, setErrors] = useState<ReviewFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  // 활동 변경 가능하므로 활동/activityId를 상태로 관리
  const [activity, setActivity] = useState<ActivityCardItem>(initialActivity);
  const [activityId, setActivityId] = useState<string>(initialActivityId);

  const jobDetailOptions = useMemo<ReviewJobDetail[]>(() => {
    if (!state.jobGroup) return [];
    return JOB_DETAIL_BY_GROUP[state.jobGroup] ?? [];
  }, [state.jobGroup]);

  const setField = useCallback(<K extends keyof ReviewWriteState>(key: K, value: ReviewWriteState[K]) => {
    setState((prev) => {
      const next = { ...prev, [key]: value };
      // 직군 변경 시 세부직무 초기화
      if (key === 'jobGroup') next.jobDetail = '';
      return next;
    });
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }, []);

  /** 활동 변경: 선택 활동으로 교체하고 입력값 초기화. */
  const changeActivity = useCallback((nextActivity: ActivityCardItem, nextActivityId: string) => {
    setActivity(nextActivity);
    setActivityId(nextActivityId);
    setState(INITIAL_STATE);
    setErrors({});
    setStep(1);
  }, []);

  const validateStep1 = useCallback((): boolean => {
    const next: ReviewFieldErrors = {};
    if (!state.jobGroup) next.jobGroup = '직무를 선택해주세요.';
    if (!state.jobDetail) next.jobDetail = '세부직무를 선택해주세요.';
    setErrors((prev) => ({ ...prev, ...next }));
    return !next.jobGroup && !next.jobDetail;
  }, [state.jobGroup, state.jobDetail]);

  const validateStep2 = useCallback((): boolean => {
    const next: ReviewFieldErrors = {};
    if (!state.overallScore) next.overallScore = '총 평점을 선택해주세요.';
    if (!state.infoScore) next.infoScore = '점수를 선택해주세요.';
    if (!state.difficultyScore) next.difficultyScore = '점수를 선택해주세요.';
    if (!state.benefitScore) next.benefitScore = '점수를 선택해주세요.';
    setErrors((prev) => ({ ...prev, ...next }));
    return !next.overallScore && !next.infoScore && !next.difficultyScore && !next.benefitScore;
  }, [state.overallScore, state.infoScore, state.difficultyScore, state.benefitScore]);

  const validateStep3 = useCallback((): boolean => {
    const next: ReviewFieldErrors = {};
    if (state.summary.trim().length < 1 || state.summary.length > SUMMARY_MAX) {
      next.summary = '한 줄 평은 최대 20자까지 입력할 수 있어요.';
    }
    if (state.strength.length < TEXT_MIN || state.strength.length > TEXT_MAX) {
      next.strength = '30 - 1,000자 이내로 입력해주세요.';
    }
    if (state.weakness.length < TEXT_MIN || state.weakness.length > TEXT_MAX) {
      next.weakness = '30 - 1,000자 이내로 입력해주세요.';
    }
    if (state.tips.length > 0 && (state.tips.length < TEXT_MIN || state.tips.length > TEXT_MAX)) {
      next.tips = '30 - 1,000자 이내로 입력해주세요.';
    }
    if (!state.jobRelevanceScore) next.jobRelevanceScore = '점수를 선택해주세요.';
    setErrors((prev) => ({ ...prev, ...next }));
    return (
      !next.summary && !next.strength && !next.weakness && !next.tips && !next.jobRelevanceScore
    );
  }, [state]);

  const goNext = useCallback(() => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  }, [step, validateStep1, validateStep2]);

  const goPrev = useCallback(() => {
    setStep((prev) => (prev === 3 ? 2 : prev === 2 ? 1 : 1));
  }, []);

  const leave = useCallback(() => {
    if (onLeave) onLeave();
    else router.push(`/activity/${activityId}`);
  }, [router, activityId, onLeave]);

  /** 인증자료 파일 검증 (확장자/크기). */
  const validateFile = useCallback((file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) return '파일은 50MB 이하의 파일을 등록할 수 있습니다.';
    const lower = file.name.toLowerCase();
    const ok = ALLOWED_FILE_EXTENSIONS.some((ext) => lower.endsWith(ext));
    if (!ok) return '이미지 파일(.jpg .gif .png .psd .ai .jpeg .tif .tiff)만 업로드 가능합니다.';
    return null;
  }, []);

  /** 파일 presigned 업로드. 성공 시 최종 URL 반환. */
  const uploadFile = useCallback(
    async (file: File): Promise<string | null> => {
      const presignedResponse = await fetch('/api/files/presigned-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          file_name: file.name,
          // category: 리뷰 인증자료용 'REVIEW' 사용. 백엔드 허용 enum 확인 필요.
          category: 'REVIEW',
          file_size: file.size,
          activity_id: Number(activityId) || undefined,
        }),
      });
      const presignedPayload = await presignedResponse.json().catch(() => ({}));
      if (!presignedResponse.ok) {
        window.alert(readApiErrorMessage(presignedPayload, '파일 업로드 URL 발급에 실패했습니다.'));
        return null;
      }
      const presignedInfo = parsePresignedUploadInfo(presignedPayload);
      if (!presignedInfo) {
        window.alert('업로드 URL 정보를 해석할 수 없습니다.');
        return null;
      }
      const uploadResponse = await fetch(presignedInfo.uploadUrl, {
        method: 'PUT',
        headers: file.type ? { 'Content-Type': file.type } : undefined,
        body: file,
      });
      if (!uploadResponse.ok) {
        window.alert('파일 업로드에 실패했습니다.');
        return null;
      }
      return presignedInfo.fileUrl || presignedInfo.uploadUrl.split('?')[0];
    },
    [activityId],
  );

  /** 리뷰 제출. url(인증자료) 선택. */
  const submit = useCallback(
    async (url?: string): Promise<void> => {
      if (submitting) return;
      setSubmitting(true);
      try {
        const payload: Record<string, unknown> = {
          activity_id: Number(activityId),
          overall_score: state.overallScore,
          info_score: state.infoScore,
          difficulty_score: state.difficultyScore,
          benefit_score: state.benefitScore,
          job_relevance_score: state.jobRelevanceScore,
          summary: state.summary,
          strength: state.strength,
          weakness: state.weakness,
          job_category: {
            job_group: state.jobGroup,
            // job_detail 선택 항목 (백엔드 스키마상 선택)
            ...(state.jobDetail ? { job_detail: state.jobDetail } : {}),
          },
          // progress_status: 수료여부. POST /v1/review body 스키마에 명시되지 않았으나
          // Step1에서 입력받으므로 함께 전송한다. 백엔드 수용 여부 확인 필요.
          ...(state.progressStatus ? { progress_status: state.progressStatus } : {}),
        };
        if (state.tips.trim().length > 0) payload.tips = state.tips;
        // 새 인증자료가 있으면 그 URL을, edit에서 미교체면 기존 URL을 유지한다.
        if (url) payload.url = url;
        else if (mode === 'edit' && initialFileUrl) payload.url = initialFileUrl;

        if (mode === 'edit') {
          if (reviewId == null) {
            window.alert('수정할 리뷰를 찾을 수 없습니다.');
            return;
          }
          try {
            await updateReview(reviewId, payload as unknown as ReviewUpdatePayload);
          } catch (err) {
            window.alert(err instanceof Error ? err.message : '리뷰 수정에 실패했습니다.');
            return;
          }
        } else {
          const response = await fetch('/api/review', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (!response.ok) {
            const errPayload = await response.json().catch(() => ({}));
            window.alert(readApiErrorMessage(errPayload, '리뷰 등록에 실패했습니다.'));
            return;
          }
        }

        if (onSuccess) onSuccess();
        else router.push(`/activity/${activityId}`);
      } catch (error) {
        console.error(`리뷰 ${mode === 'edit' ? '수정' : '등록'} 중 오류 발생:`, error);
        window.alert(`리뷰 ${mode === 'edit' ? '수정' : '등록'} 중 오류가 발생했습니다.`);
      } finally {
        setSubmitting(false);
      }
    },
    [submitting, activityId, state, router, mode, reviewId, initialFileUrl, onSuccess],
  );

  return {
    mode,
    step,
    setStep,
    state,
    setField,
    errors,
    submitting,
    activity,
    activityId,
    jobDetailOptions,
    changeActivity,
    goNext,
    goPrev,
    leave,
    validateStep3,
    validateFile,
    uploadFile,
    submit,
    limits: { SUMMARY_MAX, TEXT_MIN, TEXT_MAX },
  };
}

export type UseReviewWriteFormReturn = ReturnType<typeof useReviewWriteForm>;

/**
 * 수정 모드 프리필용: 내 리뷰 단건(MyReviewDetail) → 폼 초기값 변환.
 * 주의: 수료여부(progress_status)·활동 정보는 단건 응답에 없어 프리필되지 않는다(빈 값).
 */
export function myReviewDetailToFormState(detail: MyReviewDetail): Partial<ReviewWriteState> {
  return {
    jobGroup: detail.job_group,
    jobDetail: detail.job_detail,
    overallScore: detail.overall_score,
    infoScore: detail.info_score,
    difficultyScore: detail.difficulty_score,
    benefitScore: detail.benefit_score,
    jobRelevanceScore: detail.job_relevance_score,
    summary: detail.summary ?? '',
    strength: detail.strength ?? '',
    weakness: detail.weakness ?? '',
    tips: detail.tips ?? '',
  };
}
