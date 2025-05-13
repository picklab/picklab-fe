'use client';

import Card from '@/components/common/Card/Card';

export default function Home() {
  return (
    <div className="flex gap-5 p-6">
      <Card
        imageUrl="/imgs/cat.jpg"
        badgeText="마감임박"
        badgeVariant="deadline"
        isBookmarked={true}
        chipText="상반기 채용"
        companyName="카카오"
        title="프론트엔드 개발자"
        job="개발"
        onCardClick={() => console.log('카드클릭!')}
      />
      <Card
        imageUrl="/imgs/cat.jpg"
        badgeText="신규"
        badgeVariant="default"
        isBookmarked={false}
        chipText="인턴"
        companyName="네이버네이버네이버네이버네이버네이버네이버네이버네이버네이버네이버"
        title="데이터 분석가데이터 분석가데이터 분석가데이터 분석가데이터 분석가데이터 분석가데이터 분석가데이터 분석가데이터 분석가데이터 분석가데이터 분석가데이터 분석가데이터 분석가"
        job="기획"
        onCardClick={() => console.log('카드클릭!')}
      />
      <Card
        imageUrl="/imgs/cat.jpg"
        badgeText="추천"
        badgeVariant="intended"
        isBookmarked={false}
        chipText="하반기 채용"
        companyName="삼성전자"
        title="UX/UI 디자이너"
        job="디자인"
        onCardClick={() => console.log('카드클릭!')}
      />
    </div>
  );
}
