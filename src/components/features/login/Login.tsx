import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
const SOCIAL_LOGIN_LIST = [
  {
    id: 'kakao',
    label: '카카오톡으로 로그인',
    imgSrc: '/imgs/kakao.svg',
    backgroundColor: 'bg-[#FFE812]',
    textColor: 'text-gray-80',
    borderColor: 'border-transparent',
  },
  {
    id: 'naver',
    label: '네이버로 로그인',
    imgSrc: '/imgs/naver.svg',
    backgroundColor: 'bg-[#00C300]',
    textColor: 'text-gray-0',
    borderColor: 'border-transparent',
  },
  {
    id: 'google',
    label: '구글로 로그인',
    imgSrc: '/imgs/google.svg',
    backgroundColor: 'bg-gray-0',
    textColor: 'text-gray-90',
    borderColor: 'border-gray-40',
  },
  {
    id: 'github',
    label: 'Github로 로그인',
    imgSrc: '/imgs/github.svg',
    backgroundColor: 'bg-gray-0',
    textColor: 'text-gray-90',
    borderColor: 'border-gray-40',
  },
];
export default function Login() {
  return (
    <div className="pt-[120px] flex flex-col items-center pc:w-[388px] mobile:w-[335px]">
      <Image className="mb-4" src={'/imgs/logo.png'} width={86} height={22} alt="PickLab 로고" />
      <p className=" font-bold text-[28px] text-gray-90 mb-2.5">간편 회원가입</p>
      <p className="font-[400] text-[15px] text-gray-50 mb-[60px]">소셜 로그인으로 간편하게 로그인할 수 있습니다.</p>
      <div className="w-full flex flex-col gap-3 items-center mb-12">
        {SOCIAL_LOGIN_LIST.map((social) => (
          <button
            key={social.id}
            className={clsx(
              `w-full h-14 text-[17px] rounded-small font-medium gap-2.5 flex justify-center items-center border`,
              social.backgroundColor,
              social.textColor,
            )}
          >
            <Image src={social.imgSrc} alt={social.id} width={24} height={24} />
            {social.label}
          </button>
        ))}
      </div>
      <Link href={'/signup'}>
        <button className="border-b border-gray-50 font-medium text-[14px] text-gray-50">PICKLAB 회원가입</button>
      </Link>
    </div>
  );
}
