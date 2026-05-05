import Image from 'next/image';

export default function Banner() {
  return (
    <div className="relative w-full overflow-hidden rounded-lg mobile:h-[150px] pc:h-[300px]">
      <Image
        src="/imgs/banner/home-hero-pc.png"
        alt="IT 직무 커리어를 한눈에, 오직 픽랩에서 만나보세요!"
        fill
        className="object-cover mobile:hidden pc:block"
        priority
        sizes="1100px"
      />
      <Image
        src="/imgs/banner/home-hero-mobile.png"
        alt="IT 직무 커리어를 한눈에, 오직 픽랩에서 만나보세요!"
        fill
        className="object-cover pc:hidden mobile:block"
        priority
        sizes="335px"
      />
    </div>
  );
}
