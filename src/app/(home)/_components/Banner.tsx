'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';
import Typography from '@/components/common/Typography';
import { getActivitiesByEndpoint } from '@/lib/activity-data';


import 'swiper/css';
import 'swiper/css/pagination';

export default function Banner() {
  const router = useRouter();
  const banners = useMemo(
    () =>
      getActivitiesByEndpoint('latest', 3).map((activity) => ({
        id: activity.id,
        image: activity.thumbnail || activity.imageUrl || '/imgs/cat.jpg',
        title: activity.title,
        organizer: activity.organization || activity.companyName || '',
        period: [activity.startDate, activity.endDate]
          .filter(Boolean)
          .map((value) => value!.replace(/-/g, '.'))
          .join(' ~ '),
      })),
    [],
  );

  return (
    <div className="mobile:w-full mobile:h-[150px] pc:w-full pc:h-[400px] relative">
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
        {banners.map((banner, index) => (
          <SwiperSlide key={banner.id}>
            <button
              type="button"
              onClick={() => router.push(`/activity/${banner.id}`)}
              className="relative w-full h-full text-left"
              aria-label={`${banner.title} 상세 보기`}
            >
              <Image src={banner.image} alt={banner.title} fill className="object-cover" priority={index === 0} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 pc:p-8">
                <div className="max-w-[720px]">
                  <Typography type="Caption1Medium" className="text-gray-0/90">
                    {banner.organizer}
                  </Typography>
                  <Typography type="Heading1Bold" className="mt-1 text-gray-0 line-clamp-2 break-keep">
                    {banner.title}
                  </Typography>
                  <Typography type="Body4Medium" className="mt-2 text-gray-0/85">
                    {banner.period || '모집 일정 확인'}
                  </Typography>
                </div>
              </div>
            </button>
          </SwiperSlide>
        ))}
        {banners.length === 0 && (
          <SwiperSlide>
            <div className="relative w-full h-full">
              <Image src="/imgs/cat.jpg" alt="기본 배너" fill className="object-cover" priority />
            </div>
          </SwiperSlide>
        )}
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
