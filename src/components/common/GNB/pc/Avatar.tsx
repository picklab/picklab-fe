import clsx from 'clsx';
import { useMe } from '@/hooks/useMe';
import Image from 'next/image';
import React from 'react';

const scaleClass = {
  base: 'size-space-24', // 기본값
  lg: 'size-14',
};

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 추가 클래스 */
  className?: string;
  /** 크기 프리셋 또는 커스텀 크기 */
  scale?: keyof typeof scaleClass;
  /** 프로필 이미지 URL. 없으면 기본 이미지 */
  src?: string | null;
}

const Avatar = ({ scale = 'base', className, src, ...props }: AvatarProps) => {
  return (
    <div className={clsx('relative rounded-full border border-gray-30 overflow-hidden', scaleClass[scale], className)} {...props}>
      {src ? (
        // 업로드 이미지는 저장소 호스트가 next.config remotePatterns에 없어 next/image 대신 img로 그린다
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="아바타" className="absolute inset-0 w-full h-full object-cover rounded-full" />
      ) : (
        <Image src={'/imgs/avatar.jpg'} alt="아바타" fill className="absolute rounded-full" />
      )}
    </div>
  );
};

/** 로그인한 사용자의 프로필 이미지를 보여주는 아바타. 로그인 상태에서만 렌더해야 내 정보 요청이 나가지 않는다. */
export const MyAvatar = (props: Omit<AvatarProps, 'src'>) => {
  const { data: me } = useMe();
  return <Avatar src={me?.profileImage} {...props} />;
};

export default Avatar;
