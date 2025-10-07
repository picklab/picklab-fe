import Image from 'next/image';
import TitleTypography from './TitleTypography';

export default function Step4() {
  return (
    <div className="flex flex-col gap-8 items-center">
      <Image src="/imgs/loading.png" alt="check" width={60} height={60} />
      <TitleTypography title="회원가입 완료!" description="정상적으로 로그인되었습니다. 홈 화면으로 이동합니다." />
    </div>
  );
}
