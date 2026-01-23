'use client';
import Button from '@/components/common/Button/Button';
import CardChip from '@/components/common/Card/CardChip';
import TextArea from '@/components/common/Field/TextArea';
import Select from '@/components/common/Select/Select';
import Typography from '@/components/common/Typography';

export default function MobileArchiveDetailPage() {
  return (
    <div className="mobile:flex pc:hidden">
      <form action="" className="flex flex-col gap-8">
        <div className="flex flex-col gap-3 p-[18px] border rounded-lg">
          <div className="flex flex-col gap-1.5 p-1">
            <CardChip text="대외활동" className="cursor-pointer" />
            <div className="flex flex-col gap-0.5">
              <Typography type="Body1Semibold" className="text-gray-90 truncate">
                [크래프톤 정글] K-Digital Training 국비지원 SW개발자 육성 프로그램 11기 모집
              </Typography>
              <Typography type="Caption1Medium" className="text-gray-50">
                company
              </Typography>
            </div>
            <Typography type="Caption1Medium" className="text-gray-50">
              활동기간 00.00.00~00.00.00
            </Typography>
          </div>
          <Button label="공고 보기" size="base" buttonStyle="outlined" />
        </div>
        <div className="flex flex-col gap-[18px]">
          <div className="flex gap-2 items-end ">
            <Select
              label="담당 역할"
              id="signup-employment"
              options={[
                { label: '재직중', value: 'employed' },
                { label: '구직중', value: 'job_seeking' },
                { label: '프리랜서', value: 'freelancer' },
                { label: '학생', value: 'student' },
                { label: '기타', value: 'other' },
              ]}
              // value={signupData.userInfo.employmentStatus}
              onChange={() => {}}
              labelStatus="default"
              className="w-[143px]"
              placeholder="역할"
            />
            <Select
              id="signup-subrole"
              options={[
                { label: '재직중', value: 'employed' },
                { label: '구직중', value: 'job_seeking' },
                { label: '프리랜서', value: 'freelancer' },
                { label: '학생', value: 'student' },
                { label: '기타', value: 'other' },
              ]}
              // value={signupData.userInfo.employmentStatus}
              onChange={() => {}}
              width="default"
              className="w-[184px]"
              placeholder="세부 역할"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <TextArea
              label="활동 기록"
              placeholder="이 활동에서 어떤 역할을 맡았는지 자세히 작성해 주세요."
              status="default"
              maxLength={100}
              className="max-w-[335px]"
              //   onChange={() => {}}
              value=""
              labelStatus="default"
              id="activity-record"
            />
          </div>
        </div>

        <div className="flex flex-col gap-[18px]">
          <div>
            <Typography type="Body1Semibold" className="text-gray-90">
              관련 자료 (수료증 파일, 사진, 공고 사진 등)
            </Typography>
          </div>
          <div className="flex gap-2">
            <Button label="파일 첨부" size="base" buttonStyle="outlined" />
            <Button label="URL 첨부" size="base" buttonStyle="outlined" />
          </div>
        </div>

        <Button label="저장하기" size="base" buttonStyle="filled" className="w-40 h-12 mx-auto" />
      </form>
    </div>
  );
}
