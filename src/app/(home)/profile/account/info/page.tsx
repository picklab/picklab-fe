import Icon from '@/components/common/Icon/Icon';
import Typography from '@/components/common/Typography';
import ProfileSection from './_components/ProfileSection';
import JobSection from './_components/JobSection';

export default function InfoPage() {
  return (
    <div className="flex flex-col gap-5 pc:pb-30">
      {/*heading section */}
      <section className="flex flex-row items-center gap-1 mobile:w-[335px] mobile:relative mobile:py-4 mobile:border-b mobile:border-gray-20 pc:gap-2 pc:pb-0 pc:border-0 pc:w-full">
        <Icon icon="chevronLeft" size={24} />
        <Typography
          type="Heading2Semibold"
          className="text-gray-90 mobile:absolute mobile:left-1/2 mobile:-translate-x-1/2"
        >
          프로필 수정
        </Typography>
      </section>

      <ProfileSection />
      <JobSection />
    </div>
  );
}
