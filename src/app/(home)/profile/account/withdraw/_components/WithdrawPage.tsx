import Button from '@/components/common/Button/Button';
import CheckBoxLabel from '@/components/common/CheckBox/CheckBoxLabel';
import RadioLabel from '@/components/common/Control/RadioLabel';
import Typography from '@/components/common/Typography';

export default function WithdrawPage() {
  return (
    <div className="flex flex-col items-center max-w-[1440px]">
      <div className="h-[1297px] w-full max-w-[460px] flex flex-col gap-10 pt-10 pb-30 mx-auto">
        <div className="w-full h-[1049px] flex flex-col gap-12">
          {/*회원 탈퇴 안내 */}
          <section className="flex flex-col w-full gap-[38px] pc:pb-12 pc:border-b pc:border-gray-20">
            <div className="w-full flex flex-col items-center gap-2">
              <Typography type="Title2Bold">탈퇴안내</Typography>
              <Typography type="Body2Medium">PICKLAB 회원탈퇴를 신청하기 전 안내사항을 꼭 확인해주세요!</Typography>
            </div>
            <div className="w-full flex flex-col gap-2">
              <div className="w-full flex flex-col gap-1 py-[22px] px-5 rounded-[8px] bg-gray-10">
                <Typography type="Body2Semibold">탈퇴한 계정은 복구 및 재사용이 불가능</Typography>
                <Typography type="Caption2Regular">
                  본인을 포함해 누구도 다시 사용할 수 없으니 신중하게 결정해 주세요.
                </Typography>
              </div>
              <div className="w-full flex flex-col gap-1 py-[22px] px-5 rounded-[8px] bg-gray-10">
                <Typography type="Body2Semibold">개인정보 및 이용 기록 복구 불가능</Typography>
                <Typography type="Caption2Regular">
                  회원님의 개인정보 및 이용 기록은 모두 삭제되며 복구할 수 없습니다.
                </Typography>
              </div>
              <div className="w-full flex flex-col gap-1 py-[22px] px-5 rounded-[8px] bg-gray-10">
                <Typography type="Body2Semibold">리뷰와 댓글은 직접 삭제</Typography>
                <Typography type="Caption2Regular">
                  PICKLAB에 작성하신 리뷰와 댓글은 탈퇴 후에도 남아 있으니 필요한 경우 직접 삭제해 주세요.
                </Typography>
              </div>
              <div className="w-full flex flex-col gap-1 py-[22px] px-5 rounded-[8px] bg-gray-10">
                <Typography type="Body2Semibold">개인정보는 탈퇴 후 30일간만 보관</Typography>
                <Typography type="Caption2Regular">
                  개인정보는 탈퇴일로부터 30일간 보관 후 개인정보처리방침에 따라 안전하게 삭제됩니다.
                </Typography>
              </div>
            </div>
            <CheckBoxLabel id="withdrawal-agreement" value="" label="위 안내사항을 확인했으며, 동의합니다." />
          </section>

          {/*회원 탈퇴 사유 */}
          <section className="flex flex-col w-full gap-12">
            <div className="w-full flex flex-col gap-2 items-center">
              <Typography type="Title2Bold">탈퇴사유</Typography>
              <Typography type="Body2Medium">PICKLAB을 탈퇴하시는 이유를 알려주세요.</Typography>
            </div>
            <div className="flex flex-col gap-5 w-full">
              <RadioLabel
                label="원하는 활동 정보가 부족해요"
                id="reason-1"
                name="withdrawal-reason"
                value="insufficient-info"
              />
              <RadioLabel
                label="리뷰/정보 신뢰도가 낮다고 느꼈어요."
                id="reason-2"
                name="withdrawal-reason"
                value="low-trust"
              />
              <RadioLabel
                label="이용 방법이 복잡하거나 불편했어요."
                id="reason-3"
                name="withdrawal-reason"
                value="inconvenience"
              />
              <RadioLabel
                label="비슷한 다른 서비스를 이용하고 있어요."
                id="reason-4"
                name="withdrawal-reason"
                value="other-services"
              />
              <RadioLabel label="서비스 오류나 버그가 많았어요." id="reason-5" name="withdrawal-reason" value="bugs" />
              <RadioLabel label="기타" id="reason-6" name="withdrawal-reason" value="other" />
            </div>
          </section>
          <div className="w-full flex flex-row gap-[10px]">
            <Button size="lg" buttonStyle="outlined" label="취소" className="flex-grow" />
            <Button size="lg" buttonStyle="filled" label="탈퇴하기" className="flex-grow" />
          </div>
        </div>
      </div>
    </div>
  );
}
