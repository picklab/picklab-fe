import Avatar from '@/components/common/GNB/pc/Avatar';
import ChevronRight from '@/components/common/Icon/assets/ChevronRight';
import Typography from '@/components/common/Typography';

export default function MobileProfile() {
  return (
    <section className="flex flex-row gap-4 items-center">
      <Avatar className="w-20 h-20" scale="lg" />
      <div className="flex flex-col w-[238.5px]">
        <button className="flex flex-row items-center gap-2 w-full py-4 text-gray-90">
          <Typography type="Heading2Semibold">이름이름</Typography>
          <ChevronRight width={7.5} height={13.5} />
        </button>
        {/*TODO: 메뉴 1,2,3.. 코딩 해둔거 수정하면서 마지막 menu만 map 함수에서 -> border 없이 or Divder 활용 && hidden */}
        <div className="flex flex-row flex-wrap gap-1 w-full text-primary-60">
          <span className="flex items-center h-[20px] pr-3 border-r border-gray-20">
            <Typography type="Caption1Regular">메뉴 1</Typography>
          </span>
          <span className="flex items-center h-[20px] pr-3 border-r border-gray-20">
            <Typography type="Caption1Regular">메뉴 2</Typography>
          </span>
          <span className="flex items-center h-[20px] pr-3 border-r border-gray-20">
            <Typography type="Caption1Regular">메뉴 3</Typography>
          </span>
          <span className="flex items-center h-[20px] pr-3 border-r border-gray-20">
            <Typography type="Caption1Regular">메뉴 4</Typography>
          </span>
          <span className="flex items-center h-[20px] pr-3">
            <Typography type="Caption1Regular">메뉴 5</Typography>
          </span>
        </div>
      </div>
    </section>
  );
}
