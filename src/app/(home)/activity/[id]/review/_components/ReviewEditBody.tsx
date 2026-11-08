'use client';

import clsx from 'clsx';
import type { ActivityCardItem } from '@/app/(home)/_components/constant';
import Typography from '@/components/common/Typography';
import type { MyReviewDetail, ReviewApprovalStatus } from '@/types/review.types';
import { FieldError } from './ReviewWriteShared';
import { myReviewDetailToFormState, useReviewWriteForm } from './useReviewWriteForm';

/**
 * 리뷰 수정 화면 — 한 페이지 구성 (figma PC 3051:36748 / 모바일 3051:37633, 상태 띠 3051:36993).
 * 작성 화면(3단계)과 달리 직무·수료여부·인증자료는 수정하지 않고 평점·텍스트만 수정한다.
 * 반려 사유는 기획 결정(2026-11-06)으로 노출하지 않는다.
 */
interface ReviewEditBodyProps {
  activity: ActivityCardItem;
  activityId: string;
  reviewId: string | number;
  /** 내 리뷰 단건 조회 응답(프리필 + 기존 인증자료 object_key 유지) */
  initialReviewDetail: MyReviewDetail;
  approvalStatus?: ReviewApprovalStatus | null;
  /** 상태 띠 오른쪽 날짜(YYYY.MM.DD). 없으면 숨김 */
  statusDate?: string | null;
}

const STATUS_BANNER: Record<ReviewApprovalStatus, { label: string; tone: 'danger' | 'info'; showDate: boolean }> = {
  REJECTED: { label: '미승인 리뷰', tone: 'danger', showDate: true },
  APPROVED: { label: '승인 완료', tone: 'info', showDate: true },
  PENDING: { label: '승인 진행 중이라 수정 불가능', tone: 'danger', showDate: false },
};

const RADIO_LABELS = {
  info: ['전혀', '별로', '보통', '만족', '매우만족'],
  difficulty: ['빡셈', '바쁨', '보통', '만족', '매우만족'],
  benefit: ['최악', '별로', '보통', '만족', '매우만족'],
  jobRelevance: ['최악', '별로', '보통', '만족', '매우만족'],
} as const;

export default function ReviewEditBody({
  activity,
  activityId,
  reviewId,
  initialReviewDetail,
  approvalStatus,
  statusDate,
}: ReviewEditBodyProps) {
  const form = useReviewWriteForm({
    activity,
    activityId,
    mode: 'edit',
    reviewId,
    initialState: myReviewDetailToFormState(initialReviewDetail),
    initialObjectKey: initialReviewDetail.object_key ?? undefined,
  });
  const { state, setField, errors, limits, submitting } = form;
  const banner = approvalStatus ? STATUS_BANNER[approvalStatus] : null;
  const locked = approvalStatus === 'PENDING';

  const handleSubmit = () => {
    // 한 페이지라 단계별 검증을 한 번에 수행 (&&로 묶지 않아 모든 에러를 표시)
    const ok1 = form.validateStep1();
    const ok2 = form.validateStep2();
    const ok3 = form.validateStep3();
    if (ok1 && ok2 && ok3) form.submit();
  };

  return (
    <div className="mx-auto flex w-full max-w-[720px] flex-col gap-10 pb-20 pt-10 pc:px-5">
      <Typography tag="h1" type="Headline1SemiBold" className="text-[#1E2939]">
        리뷰 수정
      </Typography>

      {/* 활동 카드 + 승인 상태 띠 */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1 rounded-[6px] border border-gray-20 bg-gray-5 p-[19px]">
          <Typography tag="p" type="Headline1SemiBold" className="text-gray-90">
            {activity.title}
          </Typography>
          <Typography tag="p" type="Body4Medium" className="text-gray-50">
            {activity.organizer || '주최기관/단체명'}
          </Typography>
        </div>
        {banner && (
          <div
            className={clsx(
              'flex flex-col gap-1 rounded-[6px] p-3 pc:flex-row pc:items-center pc:justify-between',
              banner.tone === 'danger' ? 'bg-[#FDEFEC]' : 'bg-[#EFF6FF]',
            )}
          >
            <div className="flex items-start gap-[6px] pc:items-center">
              {banner.tone === 'danger' ? <AlertIcon /> : <CheckIcon />}
              <span
                className={clsx(
                  'text-[13px] font-semibold leading-[1.385]',
                  banner.tone === 'danger' ? 'text-[#BD2C0F]' : 'text-[#155DFC]',
                )}
              >
                {banner.label}
              </span>
            </div>
            {banner.showDate && statusDate && (
              <span className="text-[10px] font-medium leading-[1.273] text-gray-50">{statusDate}</span>
            )}
          </div>
        )}
      </div>

      {/* 평점 */}
      <div className="flex flex-col gap-5">
        <RatingRow label="활동은 얼마나 만족스러웠나요?" error={errors.overallScore}>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" onClick={() => setField('overallScore', n)} aria-label={`${n}점`} className="flex">
                <StarIcon filled={n <= state.overallScore} />
              </button>
            ))}
          </div>
        </RatingRow>
        <RatingRow label="관심직무 관련 경험이나 정보를 제공했나요?" error={errors.infoScore}>
          <EditRatingRadio labels={RADIO_LABELS.info} value={state.infoScore} onChange={(v) => setField('infoScore', v)} />
        </RatingRow>
        <RatingRow label="활동의 강도는 어땠나요?" error={errors.difficultyScore}>
          <EditRatingRadio
            labels={RADIO_LABELS.difficulty}
            value={state.difficultyScore}
            onChange={(v) => setField('difficultyScore', v)}
          />
        </RatingRow>
        <RatingRow label="활동 혜택,복지는 얼마나 좋았나요?" error={errors.benefitScore}>
          <EditRatingRadio
            labels={RADIO_LABELS.benefit}
            value={state.benefitScore}
            onChange={(v) => setField('benefitScore', v)}
          />
        </RatingRow>
        <RatingRow label="활동이 관심직무에 도움이 되었나요?" error={errors.jobRelevanceScore}>
          <EditRatingRadio
            labels={RADIO_LABELS.jobRelevance}
            value={state.jobRelevanceScore}
            onChange={(v) => setField('jobRelevanceScore', v)}
          />
        </RatingRow>
      </div>

      {/* 텍스트 */}
      <div className="flex flex-col gap-5">
        <EditTextArea
          label="활동 한 줄 평"
          required
          value={state.summary}
          onChange={(v) => setField('summary', v.slice(0, limits.SUMMARY_MAX))}
          max={limits.SUMMARY_MAX}
          error={errors.summary}
        />
        <EditTextArea
          label="활동 장점"
          required
          value={state.strength}
          onChange={(v) => setField('strength', v.slice(0, limits.TEXT_MAX))}
          max={limits.TEXT_MAX}
          error={errors.strength}
        />
        <EditTextArea
          label="활동 단점"
          required
          value={state.weakness}
          onChange={(v) => setField('weakness', v.slice(0, limits.TEXT_MAX))}
          max={limits.TEXT_MAX}
          error={errors.weakness}
        />
        <EditTextArea
          label="합격 꿀팁"
          value={state.tips}
          onChange={(v) => setField('tips', v.slice(0, limits.TEXT_MAX))}
          max={limits.TEXT_MAX}
          error={errors.tips}
        />
      </div>

      {/* 버튼: 오른쪽 정렬, 높이 40, 모서리 6 */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={form.leave}
          className="flex h-10 items-center justify-center rounded-[6px] border border-[#A5ADBB] bg-gray-0 px-4"
        >
          <Typography type="Body2Medium" className="text-gray-90">
            취소
          </Typography>
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={locked || submitting}
          className={clsx(
            'flex h-10 items-center justify-center rounded-[6px] px-4',
            locked || submitting ? 'bg-gray-10' : 'bg-primary-50 hover:bg-primary-60',
          )}
        >
          <Typography type="Body2Medium" className={locked || submitting ? 'text-gray-50' : 'text-gray-0'}>
            수정하여 다시 제출
          </Typography>
        </button>
      </div>
    </div>
  );
}

/** 평점 행: PC 가로(라벨 320 + 간격 12) / 모바일 세로(간격 12) */
function RatingRow({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 pc:flex-row pc:items-center">
      <Typography tag="p" type="Body2Semibold" className="text-gray-90 pc:w-[320px] pc:shrink-0">
        {label}
      </Typography>
      <div className="flex flex-col gap-1">
        {children}
        <FieldError message={error} />
      </div>
    </div>
  );
}

/** 5단계 라디오 32px + 라벨 12px (간격 10, 라벨 간격 3). 중앙 연결선은 원 중심 높이(16px). */
function EditRatingRadio({
  labels,
  value,
  onChange,
}: {
  labels: readonly string[];
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="relative flex items-start gap-[10px]">
      <div className="absolute left-4 top-4 h-px w-[168px] bg-gray-20" aria-hidden />
      {labels.map((label, idx) => {
        const score = idx + 1;
        const selected = value === score;
        return (
          <button
            key={label}
            type="button"
            onClick={() => onChange(selected ? 0 : score)}
            aria-pressed={selected}
            className="relative z-10 flex flex-col items-center gap-[3px]"
          >
            <RadioIcon selected={selected} />
            <span
              className={clsx(
                'whitespace-nowrap text-[12px] font-medium leading-[1.334]',
                selected ? 'text-[#004F3B]' : 'text-[#A5ADBB]',
              )}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** 텍스트 영역: 라벨 15 SemiBold(+ * 14 #DE3412), 박스 80·테두리 gray-30·모서리 4·안쪽 14/13, 카운터 11 gray-50 */
function EditTextArea({
  label,
  required,
  value,
  onChange,
  max,
  error,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  max: number;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-[2px]">
        <Typography type="Body2Semibold" className="text-gray-90">
          {label}
        </Typography>
        {required && <span className="text-[14px] font-medium leading-[1.429] text-[#DE3412]">*</span>}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="30자 이상 작성"
        className={clsx(
          'h-20 w-full resize-none rounded-[4px] border bg-gray-0 px-[14px] py-[13px] text-[12px] font-medium leading-[1.334] text-gray-90 outline-none placeholder:text-[#A5ADBB]',
          error ? 'border-danger-50' : 'border-gray-30 focus:border-primary-50',
        )}
      />
      <div className="flex items-center justify-between">
        <FieldError message={error} />
        <span className="ml-auto text-[11px] font-medium leading-[1.273] text-gray-50">
          {value.length}/{max}자
        </span>
      </div>
    </div>
  );
}

/* figma 자산 (3051:36993): 별 32, 라디오 32, 경고 20(#BD2C0F), 체크 20(#155DFC) */
function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M15.1223 3.80979C15.4189 2.98749 16.5818 2.98749 16.8783 3.80979L19.31 10.5531C19.4397 10.9129 19.7759 11.1572 20.1582 11.1694L27.3229 11.3982C28.1966 11.4261 28.5559 12.5321 27.8655 13.0683L22.2037 17.4647C21.9016 17.6993 21.7732 18.0945 21.8797 18.4618L23.8761 25.3466C24.1195 26.1861 23.1787 26.8697 22.4554 26.3787L16.5245 22.3526C16.2081 22.1377 15.7926 22.1377 15.4761 22.3526L9.54522 26.3787C8.82199 26.8697 7.88115 26.1862 8.1246 25.3466L10.121 18.4618C10.2275 18.0945 10.0991 17.6993 9.79699 17.4647L4.13512 13.0683C3.4447 12.5321 3.80407 11.4261 4.67775 11.3982L11.8425 11.1694C12.2248 11.1572 12.5609 10.9129 12.6907 10.5531L15.1223 3.80979Z"
        fill={filled ? '#FFC95C' : '#E5E7EB'}
      />
    </svg>
  );
}

function RadioIcon({ selected }: { selected: boolean }) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M29.6624 16C29.6624 23.5455 23.5455 29.6624 16 29.6624C8.45447 29.6624 2.33761 23.5455 2.33761 16C2.33761 8.45447 8.45447 2.33761 16 2.33761C23.5455 2.33761 29.6624 8.45447 29.6624 16Z"
        fill={selected ? '#CFEEDF' : '#F3F4F6'}
      />
      <path
        d="M21.6167 15.9962C21.6167 19.0984 19.1019 21.6132 15.9998 21.6132C12.8976 21.6132 10.3829 19.0984 10.3829 15.9962C10.3829 12.8941 12.8976 10.3793 15.9998 10.3793C19.1019 10.3793 21.6167 12.8941 21.6167 15.9962Z"
        fill={selected ? '#009966' : '#E5E7EB'}
      />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="shrink-0">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 2.29167C5.7428 2.29167 2.29167 5.7428 2.29167 10C2.29167 14.2572 5.7428 17.7083 10 17.7083C14.2572 17.7083 17.7083 14.2572 17.7083 10C17.7083 5.7428 14.2572 2.29167 10 2.29167ZM1.04167 10C1.04167 5.05245 5.05245 1.04167 10 1.04167C14.9476 1.04167 18.9583 5.05245 18.9583 10C18.9583 14.9476 14.9476 18.9583 10 18.9583C5.05245 18.9583 1.04167 14.9476 1.04167 10Z"
        fill="#BD2C0F"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 5.40249C10.3452 5.40249 10.625 5.68231 10.625 6.02749V11.58C10.625 11.9252 10.3452 12.205 10 12.205C9.65482 12.205 9.375 11.9252 9.375 11.58V6.02749C9.375 5.68231 9.65482 5.40249 10 5.40249Z"
        fill="#BD2C0F"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 13.0525C10.3452 13.0525 10.625 13.3323 10.625 13.6775V14.0671C10.625 14.4123 10.3452 14.6921 10 14.6921C9.65482 14.6921 9.375 14.4123 9.375 14.0671V13.6775C9.375 13.3323 9.65482 13.0525 10 13.0525Z"
        fill="#BD2C0F"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="shrink-0">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.7551 6.6623C14.9992 6.90638 14.9992 7.3021 14.7551 7.54618L8.96383 13.3374C8.84661 13.4547 8.68764 13.5205 8.52187 13.5205C8.35611 13.5205 8.19714 13.4546 8.07993 13.3374L5.24545 10.5028C5.00139 10.2587 5.0014 9.86294 5.24549 9.61887C5.48957 9.3748 5.8853 9.37482 6.12937 9.6189L8.5219 12.0116L13.8712 6.6623C14.1153 6.41822 14.511 6.41822 14.7551 6.6623Z"
        fill="#155DFC"
      />
    </svg>
  );
}
