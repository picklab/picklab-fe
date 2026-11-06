import Image from 'next/image';
import Typography from '@/components/common/Typography';

// Figma 정합(모바일 1136:81309 / PC 1136:80957, 스펙 동일): 제목 Title2Bold(28px),
// 설명 Body4Regular(13px)·2줄 분리, 제목-설명 간격 12px. 공용 TitleTypography는 PC에서
// Heading2Bold(20px)/Body3Medium(14px)이라 스펙이 달라 Step4 전용 마크업 사용.
export default function Step4() {
  return (
    // 모바일(1136:81309)은 단계 표시↔내용 간격 96 (공통 48 + 48)
    <div className="flex flex-col gap-8 items-center mobile:mt-12">
      {/* 이미지 칸 80x80, 이미지 60은 아래 정렬 */}
      <div className="flex size-20 items-end justify-center">
        <Image src="/imgs/loading.png" alt="check" width={60} height={60} />
      </div>
      <div className="flex flex-col gap-3 items-center text-center">
        <Typography tag="h1" type="Title2Bold" id="signup-title" className="break-keep text-gray-90">
          회원가입 완료!
        </Typography>
        <Typography tag="p" type="Body4Regular" id="signup-description" className="text-gray-50">
          정상적으로 로그인되었습니다.
          <br />
          홈 화면으로 이동합니다.
        </Typography>
      </div>
    </div>
  );
}
