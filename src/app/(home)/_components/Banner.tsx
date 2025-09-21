'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';

import 'swiper/css';
import 'swiper/css/pagination';

// 배너 데이터
const BANNER_MOCK = [
  {
    id: 1,
    image: '/imgs/placeholder_mo_list.png',
  },
  {
    id: 2,
    image: '/imgs/ThreeDImagePlaceHolder.jpg',
  },
  {
    id: 3,
    image: '/imgs/cat.jpg',
  },
];

export default function Banner() {
  return (
    <div className="mobile:w-full mobile:h-[200px] pc:w-full pc:h-[400px] relative">
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet !bg-white !opacity-50',
          bulletActiveClass: 'swiper-pagination-bullet-active !bg-white !opacity-100',
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="w-full h-full rounded-lg overflow-hidden"
      >
        {BANNER_MOCK.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className="relative w-full h-full">
              <Image src={banner.image} alt={banner.image} fill className="object-cover" priority={banner.id === 1} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 커스텀 스타일 */}
      <style jsx global>{`
        .swiper-button-prev,
        .swiper-button-next {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 50%;
          transition: background 0.3s ease;
        }
        .swiper-button-prev:hover,
        .swiper-button-next:hover {
          background: rgba(0, 0, 0, 0.5);
        }
        .swiper-pagination {
          bottom: 20px !important;
        }
        .swiper-pagination-bullet {
          width: 8px !important;
          height: 8px !important;
          margin: 0 4px !important;
        }
      `}</style>
    </div>
  );
}
