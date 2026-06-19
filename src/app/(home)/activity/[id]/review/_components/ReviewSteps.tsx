'use client';

import clsx from 'clsx';
import Typography from '@/components/common/Typography';
import Select from '@/components/common/Select/Select';
import {
  JOB_GROUP_OPTIONS,
  REVIEW_STATUS_OPTIONS,
  jobDetailLabel,
  jobGroupLabel,
  type ReviewJobDetail,
  type ReviewJobGroup,
  type ReviewProgressStatus,
} from '@/types/review.types';
import type { UseReviewWriteFormReturn } from './useReviewWriteForm';
import { FieldError, RatingRadio, StarRating, StarRatingLabel } from './ReviewWriteShared';

const jobGroupSelectOptions = JOB_GROUP_OPTIONS.map((g) => ({ label: jobGroupLabel(g), value: g }));

/** Step 1 — 직무/수료여부 선택. onOpenChangeModal 미전달 시(수정 모드) "활동 변경" 숨김. */
export function Step1({ form, onOpenChangeModal }: { form: UseReviewWriteFormReturn; onOpenChangeModal?: () => void }) {
  const { state, setField, errors, activity, jobDetailOptions } = form;

  const detailOptions = jobDetailOptions.map((d) => ({ label: jobDetailLabel(d), value: d }));
  const statusOptions = REVIEW_STATUS_OPTIONS.map((o) => ({ label: o.label, value: o.value }));

  return (
    <div className="flex flex-col gap-space-24">
      <div className="flex items-center justify-between">
        <Typography type="Heading1Semibold" className="text-gray-90">
          선택한 활동
        </Typography>
        {onOpenChangeModal && (
          <button
            type="button"
            onClick={onOpenChangeModal}
            className="flex h-[30px] items-center justify-center rounded-full border border-primary-50 px-3 py-1.5 hover:bg-primary-5"
          >
            <Typography type="Body4Medium" className="whitespace-nowrap text-primary-60">
              {activity.title ? '활동 변경하기' : '활동 선택하기'}
            </Typography>
          </button>
        )}
      </div>

      <div
        className={`w-full rounded-lg border border-gray-20 bg-gray-5 px-5 ${
          activity.title ? 'py-4' : 'flex h-[58px] items-center'
        }`}
      >
        {activity.title ? (
          <>
            <Typography tag="p" type="Body1Semibold" className="text-gray-90">
              {activity.title}
            </Typography>
            <Typography tag="p" type="Body3Regular" className="mt-1 text-gray-50">
              {activity.organizer || '주최기관/단체명'}
            </Typography>
          </>
        ) : (
          <Typography tag="p" type="Body2Medium" className="text-gray-50">
            선택된 활동이 없습니다.
          </Typography>
        )}
      </div>

      <div className="mt-12 flex flex-col gap-8">
        <Typography tag="p" type="Heading1Semibold" className="text-gray-90">
          어떤 직무경험을 기대하고 참여했나요?
        </Typography>

        <div className="grid grid-cols-1 gap-4 pc:grid-cols-2">
        <div className="flex flex-col gap-1">
          <Typography type="Body3Medium" className="text-gray-90">
            직무를 선택해주세요 <span className="text-danger-50">*</span>
          </Typography>
          <Select
            placeholder="직무 선택"
            options={jobGroupSelectOptions}
            value={state.jobGroup}
            onChange={(v) => setField('jobGroup', (v as ReviewJobGroup) ?? '')}
            width="full"
            helpMessageStatus={errors.jobGroup ? 'error' : 'default'}
          />
          <FieldError message={errors.jobGroup} />
        </div>
        <div className="flex flex-col gap-1">
          <Typography type="Body3Medium" className="text-gray-90">
            세부직무를 선택해주세요 <span className="text-danger-50">*</span>
          </Typography>
          <Select
            placeholder="세부직무 선택"
            options={detailOptions}
            value={state.jobDetail}
            onChange={(v) => setField('jobDetail', (v as ReviewJobDetail) ?? '')}
            width="full"
            disabled={!state.jobGroup}
            helpMessageStatus={errors.jobDetail ? 'error' : 'default'}
          />
          <FieldError message={errors.jobDetail} />
        </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Typography type="Body3Medium" className="text-gray-90">
          수료여부
        </Typography>
        <Select
          placeholder="선택"
          options={statusOptions}
          value={state.progressStatus}
          onChange={(v) => setField('progressStatus', (v as ReviewProgressStatus) ?? '')}
          width="full"
        />
      </div>
    </div>
  );
}

/** Step 2 — 점수. */
export function Step2({ form }: { form: UseReviewWriteFormReturn }) {
  const { state, setField, errors } = form;
  return (
    <div className="flex flex-col gap-space-40">
      <div className="flex flex-col items-center gap-3">
        <Typography type="Heading1Semibold" className="text-gray-90">
          총 평점
        </Typography>
        <StarRating value={state.overallScore} onChange={(v) => setField('overallScore', v)} />
        <StarRatingLabel value={state.overallScore} />
        <FieldError message={errors.overallScore} />
      </div>

      <RatingRadio
        question="관심직무 관련 경험이나 정보를 제공했나요?"
        labels={['전혀', '별로', '보통', '만족', '매우만족']}
        value={state.infoScore}
        onChange={(v) => setField('infoScore', v)}
        error={errors.infoScore}
      />
      <RatingRadio
        question="활동의 강도는 어땠나요?"
        labels={['빡셈', '바쁨', '보통', '만족', '매우만족']}
        value={state.difficultyScore}
        onChange={(v) => setField('difficultyScore', v)}
        error={errors.difficultyScore}
      />
      <RatingRadio
        question="활동 혜택 / 복지는 얼마나 좋았나요?"
        labels={['최악', '별로', '보통', '만족', '매우만족']}
        value={state.benefitScore}
        onChange={(v) => setField('benefitScore', v)}
        error={errors.benefitScore}
      />
    </div>
  );
}

interface ReviewTextAreaProps {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  max: number;
  counterMax: number;
  /** false면 max 초과 입력을 허용하고 검증에서 에러로 처리(한 줄 평). 기본 true는 입력 자체를 max로 제한. */
  enforceMax?: boolean;
  error?: string;
}

function ReviewTextArea({
  label,
  required,
  value,
  onChange,
  placeholder,
  max,
  counterMax,
  enforceMax = true,
  error,
}: ReviewTextAreaProps) {
  const isOver = value.length > counterMax;
  return (
    <div className="flex flex-col gap-1">
      <Typography type="Body3Medium" className="text-gray-90">
        {label} {required && <span className="text-danger-50">*</span>}
      </Typography>
      <textarea
        value={value}
        onChange={(e) => onChange(enforceMax ? e.target.value.slice(0, max) : e.target.value)}
        placeholder={placeholder}
        className={clsx(
          'min-h-[96px] w-full resize-none rounded-md border px-4 py-3 text-[15px] text-gray-90 outline-none placeholder:text-gray-40',
          error || isOver ? 'border-danger-50' : 'border-gray-30 focus:border-primary-50',
        )}
      />
      <div className="flex items-center justify-between">
        <FieldError message={error} />
        <Typography type="Body4Regular" className={clsx('ml-auto', isOver ? 'text-danger-50' : 'text-gray-40')}>
          {value.length}/{counterMax}자
        </Typography>
      </div>
    </div>
  );
}

/** Step 3 — 텍스트 + 직무연관성. */
export function Step3({ form }: { form: UseReviewWriteFormReturn }) {
  const { state, setField, errors, limits } = form;
  return (
    <div className="flex flex-col gap-space-24">
      <ReviewTextArea
        label="활동 한 줄 평"
        required
        value={state.summary}
        onChange={(v) => setField('summary', v)}
        max={limits.SUMMARY_MAX}
        counterMax={limits.SUMMARY_MAX}
        enforceMax={false}
        error={errors.summary}
      />
      <ReviewTextArea
        label="활동 장점"
        required
        value={state.strength}
        onChange={(v) => setField('strength', v)}
        placeholder="30자 이상 작성"
        max={limits.TEXT_MAX}
        counterMax={limits.TEXT_MAX}
        error={errors.strength}
      />
      <ReviewTextArea
        label="활동 단점"
        required
        value={state.weakness}
        onChange={(v) => setField('weakness', v)}
        placeholder="30자 이상 작성"
        max={limits.TEXT_MAX}
        counterMax={limits.TEXT_MAX}
        error={errors.weakness}
      />
      <ReviewTextArea
        label="합격 꿀팁"
        value={state.tips}
        onChange={(v) => setField('tips', v)}
        placeholder="30자 이상 작성"
        max={limits.TEXT_MAX}
        counterMax={limits.TEXT_MAX}
        error={errors.tips}
      />

      <RatingRadio
        question="활동이 관심직무에 도움이 되었나요?"
        labels={['최악', '별로', '보통', '만족', '매우만족']}
        value={state.jobRelevanceScore}
        onChange={(v) => setField('jobRelevanceScore', v)}
        error={errors.jobRelevanceScore}
      />
    </div>
  );
}
