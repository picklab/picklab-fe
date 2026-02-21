interface Activity {
  id: string;
  imageUrl: string;
  badgeText: string;
  badgeVariant: 'default' | 'deadline' | 'intended';
  isBookmarked: boolean;
  chipText: string;
  companyName: string;
  title: string;
  jobs: ('기획' | '개발' | '마케팅' | '디자인' | 'AI' | '기타' | '서포터즈' | '멘토링' | '사진/영상/UCC' | '창업' | '봉사단-국내' | '학술' | '네이밍/슬로건' | '문학/시나리오')[];
  onBookmarkClick?: (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>) => void;
  onCardClick: () => void;
  organization?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  isFinished: boolean;
  label?: string;
  saveCount?: number;
  viewCount?: number;
  onListClick: () => void;
}

const csvData = `상세링크,활동유형,출처,제목,주최기관,기업형태,참여대상,접수기간,활동기간,모집인원,모임지역,홈페이지,공모분야,활동분야,비용/시상규모
/activity/299031,대외활동,링커리어,[수상 스펙 목표] 공모전 수상을 위한 프로젝트,기역미음지읒2(ㄱㅁㅈ2),비영리단체/협회/재단,대상 제한 없음,2026.01.29 ~ 상시모집,25.12 ~ 26.12,00명,서울 은평구,https://www.gmieumj2.com,,마케터; 기타,
/activity/299030,대외활동,링커리어,"[무공동] 공모전 대외활동의 마지막 희망, 멤버 모집",[무공동],동아리/학생자치단체,대상 제한 없음,2026.01.29 ~ 상시모집,25.12 ~ 26.12,00명,서울 은평구,https://www.mgclub.co.kr/,,기타; 마케터,
/activity/299028,대외활동,링커리어,"[SpecUpdate] 신선한 스펙 업데이트, 공모전 수상 + 인턴 경험, 한 번에 끝내는 프로젝트",스펙업데이트 (SpecUpdate),비영리단체/협회/재단,대상 제한 없음,2026.01.29 ~ 상시모집,25.12 ~ 26.12,00명,서울 은평구,https://www.specup.me/,,마케터; 기타,
/activity/299022,대외활동,링커리어,2026 달성군청소년센터 청소년 자치기구,달성군청소년센터,비영리단체/협회/재단,"청소년, 대학생",2026.01.28 ~ 2026.02.12,26.1.28 ~ 26.2.12,00명,대구 달성군,,,기타; 서포터즈,
/activity/299020,대외활동,링커리어,[시립마포청소년센터] YNBC대학생미디어활동단 국원 모집,시립마포청소년센터,비영리단체/협회/재단,"청소년, 대학생",2026.01.29 ~ 2026.02.24,26.1 ~ 26.12,20명,서울 마포구,https://www.youthnaroo.or.kr/sub08/sub09.php?ptype=view&idx=5651,,서포터즈; 기타,
/activity/299017,대외활동,링커리어,2026 지구의 날 홍보 서포터즈 지구수호대 5기 모집,서울특별시,공공기관/공기업,대학생,2026.01.27 ~ 2026.02.24,26.2 ~ 26.4,00명,지역 제한없음,https://docs.google.com/forms/d/e/1FAIpQLSdljlPon2mCvE5P9G_R3IsqDtHxzMjJ5RVBKNdR6M-VfUaGvw/viewform,,서포터즈,
/activity/299016,대외활동,링커리어,[청소년/지역활동] 2026 청개구리 문화놀이터 자원활동가/활동부스 모집,고리울청소년센터,공공기관/공기업,대상 제한 없음,2026.01.29 ~ 2026.02.20,26.2 ~ 26.12,00명,"서울, 인천, 경기 부천시",https://www.kumayouth.or.kr/,,서포터즈; 멘토링,
/activity/299009,대외활동,링커리어,[강동노인종합복지관] 2026년 대학생 서포터즈 '강동 윙즈' 18기 모집안내(~2/22),서울특별시립강동노인종합복지관,비영리단체/협회/재단,대학생,2026.01.29 ~ 2026.02.22,26.2 ~ 26.11,12명,서울 강동구,https://www.gdsw.or.kr/,,서포터즈,
/activity/299006,대외활동,링커리어,[꼼지락발전소] 2026 청소년운영위원회 톱니연구소 8기 참가자 모집,대구광역시청소년문화의집,비영리단체/협회/재단,청소년,2026.01.15 ~ 모집 시 마감,26.2 ~ 26.12,00명,지역 제한없음,https://www.xn--cs0bw61c.com/bbs/board.php?bo_table=program01&wr_id=550,,기타; 멘토링,
/activity/299005,대외활동,링커리어,울산광역시강북교육지원청「2026년 교육복지이음단」 이음단원 모집,울산광역시교육청,공공기관/공기업,대상 제한 없음,2026.01.25 ~ 2026.02.06,26.1 ~ 26.12,0명,울산 전체,https://www.yesulsan.kr/teenager/area_view.jsp?ac_num=460&crp=23,,봉사단-국내,
/activity/299002,대외활동,링커리어,"[골든래빗] <빠르게 따는 ITQ>(한글, 엑셀, PPT) 베타리더 20명 한정 모집",골든래빗,스타트업,대상 제한 없음,2026.01.29 ~ 2026.02.12,25.12 ~ 26.2,0명,지역 제한없음,,,서포터즈,
/activity/299000,대외활동,링커리어,제10기 광주은행 톡톡(Talk-Talk)자문단(고객 패널) 모집,광주은행,금융권,대상 제한 없음,2026.01.29 ~ 2026.02.05,26.1 ~ 26.12,0명,광주,https://pib.kjbank.com/ib20/mnu/BPB0000000001,,서포터즈,
/activity/298989,대외활동,링커리어,[굿네이버스 경기수원1지부] 아동권리옹호 서포터즈 I.R.I.S. 모집,굿네이버스 경기수원지부,비영리단체/협회/재단,대상 제한 없음,2026.01.29 ~ 모집 시 마감,26.2 ~ 26.12,00명,경기 수원시,https://goodsuwon.gcps.or.kr/,,서포터즈,
/activity/298972,대외활동,링커리어,26년 후기청소년자원봉사단 애플 신규단원 '추가' 모집,창동청소년문화의집,공공기관/공기업,대학생,2026.01.31 ~ 2026.02.18,26.2 ~ 26.12,00명,"서울 강북구, 노원구, 도봉구",,,봉사단-국내; 서포터즈,
/activity/298969,대외활동,링커리어,[인천광역시교육청 진로교육센터] 2026년 상담지원단(진로상담사) 모집,인천광역시교육청 진로교육센터,비영리단체/협회/재단,직장인/일반인,2026.01.27 ~ 2026.02.08,26.1 ~ 27.1,00명,인천 전체,https://cyberjinro.ice.go.kr/main,,서포터즈,
/activity/298965,대외활동,링커리어,[인천광역시교육청 진로교육센터] 2026년 대학생지원단 10기 모집,인천광역시교육청 진로교육센터,비영리단체/협회/재단,대학생,2026.01.20 ~ 2026.02.10,25.12 ~ 26.12,00명,인천 전체,https://cyberjinro.ice.go.kr/main,,서포터즈; 멘토링,
/activity/298949,대외활동,링커리어,IT 취업 준비? 자바 풀스택부터 챗GPT 활용 AI 데이터 분석 교육까지,(주)솔데스크,중소기업,"대학생, 직장인/일반인",2026.01.29 ~ 2026.03.03,26.2 ~ 26.9,00명,"서울 강남구, 종로구",https://www.soldesk.com/JS_edu_01,,강연; 기타,
/activity/298940,대외활동,링커리어,[남양주시] 2026 남양주시 청년 취업 멘토링 콘서트 (~2/21),Curiosity Project Team,비영리단체/협회/재단,대상 제한 없음,2026.01.29 ~ 2026.02.21,26.1 ~ 26.2,00명,지역 제한없음,http://www.cpteam.co.kr/,,멘토링; 강연,
/activity/298929,대외활동,링커리어,2026년 디지털성범죄예방동아리 '부엉이서포터즈3기' 모집,서대문구청소년상담복지센터,비영리단체/협회/재단,대학생,2026.01.29 ~ 2026.03.07,26.2 ~ 26.12,15명,서울 서대문구,https://www.sdm7979.or.kr,,서포터즈; 기타,
/activity/298924,대외활동,링커리어,2026 생각지대 상반기 운영진 정기모집,전국학생건축포럼 생각지대,비영리단체/협회/재단,대학생,2026.01.29 ~ 2026.02.04,26.1 ~ 26.8,11명,서울 전체,http://saenggakjidae.com,,기타,
/activity/299034,공모전/해커톤,링커리어,보은군청 2026년 보은군 드론 영상공모전,보은군청,공공기관/공기업,대상 제한 없음,2026.02.01 ~ 2026.05.22,,,,,사진/영상/UCC,,700만 원
/activity/298996,공모전/해커톤,링커리어,처음 시작하는 전략기획: 뷰티 전략기획 4-Step 실전 공모전,주식회사 어치브모먼트,스타트업,대상 제한 없음,2026.01.29 ~ 2026.02.19,,,,https://www.blaybus.com/activities/677/landing?utm_source=linkaeer&utm_medium=activity&utm_campaign=click,기획/아이디어; 광고/마케팅,,-
/activity/298988,공모전/해커톤,링커리어,2026 드림라이언즈,칸라이언즈서울,중소기업,대학생,2026.01.26 ~ 2026.03.11,,,,https://www.canneslions.co.kr/younglions/student/2026,기획/아이디어; 광고/마케팅,,1500만 원
/activity/298978,공모전/해커톤,링커리어,2026 핀업컨셉디자인어워드,한국디자인혁신협회,비영리단체/협회/재단,"대학생, 직장인/일반인",2025.12.31 ~ 2026.02.28,,,,http://www.pinup.or.kr/concept/,기획/아이디어; 디자인/순수미술/공예,,1000만 원
/activity/298967,공모전/해커톤,링커리어,취업 콘텐츠 출연자 모집,서울대학교 대학연대 지역인재양성 사업단,공공기관/공기업,대학생,2026.01.29 ~ 상시모집,,,,https://iitd.kr,사진/영상/UCC; 기획/아이디어,,10만 원
/activity/298962,공모전/해커톤,링커리어,[중랑문화재단] 2026 중랑아트센터 한평갤러리 '이달의 작가' 모집 공고,중랑문화재단,비영리단체/협회/재단,대상 제한 없음,2026.01.12 ~ 2026.02.08,,,,https://www.jnfac.or.kr/art/board/62/12742,디자인/순수미술/공예,,-\r
/activity/298861,공모전/해커톤,링커리어,"[청년] 실패하면 박수받는 곳, 챠챠챠 6기 모집 시작!",사단법인 유쾌한반란,비영리단체/협회/재단,대상 제한 없음,2026.01.18 ~ 2026.02.22,,,,https://www.queran.or.kr/,기획/아이디어; 기타,,1000만 원
/activity/298761,공모전/해커톤,링커리어,한글문화도시 브랜드 슬로건 공모전,고려대학교 세종RISE사업단,중소기업,대상 제한 없음,2026.01.26 ~ 2026.02.08,,,,https://www.loud.kr/contest/view/194293/brief,네이밍/슬로건,,100만 원
/activity/298749,공모전/해커톤,링커리어,[한국토지주택공사] 2026 국토도시 데이터 분석 공모전,한국토지주택공사,공공기관/공기업,대상 제한 없음,2026.01.29 ~ 2026.03.20,,,,https://www.lh.or.kr/index.es?sid=a1,기획/아이디어; 학술,,1200만 원
/activity/298740,공모전/해커톤,링커리어,2026 서울특별시 규제혁신 아이디어 공모전,서울특별시,공공기관/공기업,대상 제한 없음,2026.01.25 ~ 2026.02.19,,,,https://mediahub.seoul.go.kr/gongmo/2000705,기획/아이디어,,500만 원
/activity/298738,공모전/해커톤,링커리어,제1회 바로팜 X 비약 약대생 영상 콘텐츠 공모전 안내,바로팜,중소기업,대학생,2026.01.25 ~ 2026.02.08,,,,https://www.instagram.com/p/DUDAzP6Em7G/,사진/영상/UCC,,200만 원
/activity/298736,공모전/해커톤,링커리어,제20회 창비청소년문학상,(주)창비,중소기업,대상 제한 없음,2025.09.30 ~ 2026.04.30,,,,https://changbi.com,문학/시나리오,,2000만 원
/activity/298733,공모전/해커톤,링커리어,2026년 대학생 멘토링 동아리 지원사업 11기 참여 동아리 공모 안내,한국사회복지협의회,공공기관/공기업,대학생,2026.01.28 ~ 2026.03.15,,,,https://blog.naver.com/ssnmentoring,기획/아이디어; 기타,,200만 원
/activity/298726,공모전/해커톤,링커리어,2026 겨울 숏폼 영상 공모전 「한산하니 좋다!」,한전산업개발(주),중견기업,대상 제한 없음,2026.01.21 ~ 2026.02.19,,,,http://kepid.co.kr/home/index.asp,기획/아이디어; 사진/영상/UCC,,200만 원
/activity/298679,공모전/해커톤,링커리어,크라우드 펀딩 챌린지,주식회사 볼트앤너트,스타트업,"대학생, 직장인/일반인",2026.01.29 ~ 2026.02.01,,,,https://buly.kr/4xYvU63,기획/아이디어; 창업,,-
/activity/298612,공모전/해커톤,링커리어,제29회 대한민국 옻칠 목공예대전,남원시,공공기관/공기업,대상 제한 없음,2026.01.27 ~ 2026.04.05,,,,,디자인/순수미술/공예,,1억 4000만 원
/activity/298611,공모전/해커톤,링커리어,2026년 중랑신문 디카시 신춘문예 공모전,(주)중랑신문,중소기업,대상 제한 없음,2026.01.27 ~ 2026.03.31,,,,,사진/영상/UCC,,170만 원
/activity/298610,공모전/해커톤,링커리어,우리 강아지가 브랜드의 얼굴이 됩니다! [멍스코리아],포토시그니처,중소기업,대상 제한 없음,2026.01.27 ~ 2026.02.23,,,,,사진/영상/UCC,,-\r
/activity/298600,공모전/해커톤,링커리어,2026 광화문글판 여름편 문안 공모,교보생명,대기업,대상 제한 없음,2026.01.27 ~ 2026.04.05,,,,,문학/시나리오,,100만 원
/activity/298592,공모전/해커톤,링커리어,대한류마티스학회 통풍 안심요리 60초 레시피 영상 공모전,대한류마티스학회,비영리단체/협회/재단,대상 제한 없음,2026.01.27 ~ 2026.02.20,,,,,사진/영상/UCC,,400만 원
/activity/299045,교육,링커리어,"[취업요청 최다과정] 반도체장비 제어 전문가 [PLC,영상비전제어] 채용연계과정",대한상공회의소 서울기술교육센터,,,2026.01.29 ~ 모집 시 마감,2026.03.09 ~ 2026.09.18,25명,지역 제한없음,https://www.kccistc.net/,,,무료(국비지원)
/activity/299035,교육,링커리어,[국비지원-KDC] 데이터 분석 모델링 DBA의 첫걸음 SQL 마스터하기 29회차,KH정보교육원 강남지원,,,2026.01.28 ~ 2026.02.11,2026.02.11 ~ 2026.03.11,1000명,지역 제한없음,https://khacademy.co.kr/,,,2만원(국비지원)
/activity/299033,교육,링커리어,2026 양천구 청년도전지원사업 참여자 모집,고용노동부/서울청년센터 양천,,,2025.12.31 ~ 2026.09.10,2026.03.05 ~ 2026.10.30,105명,서울 양천구,,,,무료(국비지원)
/activity/298991,교육,링커리어,[국비지원] 글로벌 관광MICE 컨벤션기획 취업준비생 모집,양정인력개발센터,,,2026.01.29 ~ 2026.02.03,2026.02.02 ~ 2026.05.14,20명,"서울, 부산, 대구, 인천, 광주, 대전, 울산, 경기, 강원, 충청, 전라, 경상",https://www.jobyj.co.kr/,,,무료(국비지원)
/activity/298986,교육,링커리어,[회계/사무/총무/인사 등] 취업필수 자격증 국비지원반 모집,양정인력개발센터,,,2026.01.29 ~ 2026.02.03,2026.02.09 ~ 2026.03.31,20명,"부산, 경상",https://www.jobyj.co.kr/,,,무료(국비지원)
/activity/298984,교육,링커리어,[단기속성] 국비지원 컴활2급 자격증 취득반!!,양정인력개발센터,,,2026.01.29 ~ 2026.02.03,2026.02.04 ~ 2026.03.17,14명,"부산, 경상",https://www.jobyj.co.kr/,,,무료(국비지원)
/activity/298920,교육,링커리어,[인천대학교] 화장품 제조 및 품질관리 양성과정 교육생 모집,인천대학교,,,2026.01.26 ~ 2026.02.01,2026.02.22 ~ 2026.05.07,24명,인천 연수구,https://www.inu.ac.kr/inu/index.do?epTicket=LOG,,,무료
/activity/298919,교육,링커리어,[모두의연구소] 생성형 AI를 활용한 15초 광고(숏폼) 만들기,모두의연구소,,,2026.01.28 ~ 2026.02.02,2026.02.02 ~ 2026.03.04,25명,지역 제한없음,https://modulabs.co.kr/,,,2만원(국비지원)
/activity/298918,교육,링커리어,[모두의연구소] 상위 1% 일잘러를 위한 고급 프롬프트 엔지니어링,모두의연구소,,,2026.01.28 ~ 2026.02.02,2026.02.02 ~ 2026.03.04,25명,지역 제한없음,https://modulabs.co.kr/,,,1만원(국비지원)
/activity/298917,교육,링커리어,"[코드잇] AI로 나만의 콘텐츠 완성: PPT, 숏폼, 상세페이지까지",코드잇,,,2026.01.28 ~ 2026.02.02,2026.02.02 ~ 2026.03.03,100명,지역 제한없음,https://www.codeit.kr/,,,5만원(국비지원)
/activity/298916,교육,링커리어,[코드잇] [4주 완성] 누구나 쉽게 써먹는 파이썬 데이터 분석,코드잇,,,2026.01.28 ~ 2026.02.02,2026.02.02 ~ 2026.03.03,100명,지역 제한없음,https://www.codeit.kr/,,,5만원
/activity/298914,교육,링커리어,[코드잇] 피그마(Figma)와 AI로 쉽게 배우는 UI 디자인,코드잇,,,2026.01.28 ~ 2026.02.02,2026.02.02 ~ 2026.03.03,100명,지역 제한없음,https://www.codeit.kr/,,,5만원(국비지원)
/activity/298912,교육,링커리어,[코드잇] [스프린트 라이트] Python 프로그래밍 기초,코드잇,,,2026.01.28 ~ 2026.02.02,2026.02.02 ~ 2026.03.03,100명,지역 제한없음,https://www.codeit.kr/,,,5만원(국비지원)
/activity/298911,교육,링커리어,[코드잇] 생성형 AI 시대 필수: 챗GPT로 배우는 LLM 활용법,코드잇,,,2026.01.28 ~ 2026.02.02,2026.02.02 ~ 2026.03.03,100명,지역 제한없음,https://www.codeit.kr/,,,5만원(국비지원)
/activity/298872,교육,링커리어,[인턴기회] 클라우드 개발자 국비교육 6기 모집,더존비즈온,,,2026.01.28 ~ 2026.02.06,2026.02.24 ~ 2026.08.26,00명,지역 제한없음,https://soft.kdt-douzone.com/,,,무료(국비지원)
/activity/298871,교육,링커리어,안산(기숙사) 스마트팜&스마트팩토리 취업 교육 [MCU기반 임베디드] 자부담금 없이 전액 국비 받을 수 있습니다.,한국직업능력교육원,,,2026.01.28 ~ 2026.02.11,2026.02.10 ~ 2026.08.13,20명,경기 안산시,https://graceful-move-836.notion.site/AI-MCU-STM32-ESP32-1900490cfab5807db70cf978fbd843ea,,,무료(국비지원)
/activity/298869,교육,링커리어,"[IBM]이 직접 만든, AI개발자 AX Academy 7기",IBM×RedHat,,,2026.01.28 ~ 2026.02.10,2026.02.11 ~ 2026.08.17,00명,지역 제한없음,https://soft.hi-kdt.com/,,,무료(국비지원)
/activity/298867,교육,링커리어,대기업 주관 클라우드 인프라 [실시간 온라인]부트캠프 KT테크업,kt cloud,,,2026.01.28 ~ 2026.02.27,2026.03.16 ~ 2026.10.07,20명,지역 제한없음,https://graceful-move-836.notion.site/kt-Cloud-2630490cfab58087b79ef40972006df0,,,60만원(국비지원)
/activity/298863,교육,링커리어,KDT우수성과기관에서 IT웹개발 K-디지털트레이닝 교육받아 취업까지 [직전 취업률88%],한국정보교육원,,,2026.01.28 ~ 2026.03.03,2026.03.29 ~ 2026.09.29,20명,서울 관악구,https://one-itedu.com/,,,40만원(국비지원)
/activity/298860,교육,링커리어,응시자격 없이 정보처리산업기사 취득하는 방법(+웹개발자 취업 +수료 후 KDT 국비 한번 더 가능),한국정보교육원,,,2026.01.28 ~ 2026.03.03,2026.03.02 ~ 2026.08.18,21명,서울 관악구,https://one-itedu.com/,,,37만원(국비지원)`;

const parseDateString = (dateStr: string): Date | null => {
  if (!dateStr || dateStr.toLowerCase() === '상시모집') return null;
  const parts = dateStr.split(/[\.~]/).map(p => p.trim()).filter(Boolean);
  if (parts.length < 3) return null;

  let year = parseInt(parts[0], 10);
  // Handle '25.12' to '2025.12'
  if (year < 100) year += 2000;

  const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
  const day = parseInt(parts[2], 10);

  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
  return new Date(year, month, day);
};

const getBadgeInfo = (
  period: string,
): { badgeText: string; badgeVariant: Activity['badgeVariant']; isFinished: boolean } => {
  const today = new Date('2026-02-08'); // Current date for comparison
  const [startStr, endStr] = period.split('~').map(s => s.trim());
  
  const startDate = parseDateString(startStr);
  const endDate = parseDateString(endStr);

  if (!startDate || !endDate) {
    return { badgeText: '상시모집', badgeVariant: 'default', isFinished: false };
  }

  if (today > endDate) {
    return { badgeText: '마감', badgeVariant: 'deadline', isFinished: true };
  }

  const diffTime = Math.abs(endDate.getTime() - today.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 7) {
    return { badgeText: `D-${diffDays}`, badgeVariant: 'deadline', isFinished: false };
  }
  
  return { badgeText: '모집중', badgeVariant: 'default', isFinished: false };
};

export const mockActivities: Activity[] = csvData
  .split('\\n')
  .slice(1) // Skip header row
  .map((row, index) => {
    const columns = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); // Split by comma, ignore commas inside double quotes

    const detailLink = columns[0];
    const activityType = columns[1];
    const source = columns[2];
    const title = columns[3].replace(/^\"|\"$/g, ''); // Remove surrounding quotes
    const organization = columns[4];
    const companyType = columns[5];
    const target = columns[6];
    const applicationPeriod = columns[7];
    const activityPeriod = columns[8];
    const recruitNumber = columns[9];
    const meetingArea = columns[10];
    const homepage = columns[11];
    const contestField = columns[12];
    const activityField = columns[13];
    const costAwardScale = columns[14];

    const { badgeText, badgeVariant, isFinished } = getBadgeInfo(applicationPeriod);

    const activityStartDate = parseDateString(activityPeriod.split('~')[0]);
    const activityEndDate = parseDateString(activityPeriod.split('~')[1]);

    const jobs = [
      ...((contestField || '').split(';').map(job => job.trim()).filter(Boolean) as Activity['jobs']),
      ...((activityField || '').split(';').map(job => job.trim()).filter(Boolean) as Activity['jobs']),
    ];

    return {
      id: detailLink.split('/').pop() || `${index}`,
      imageUrl: `https://picsum.photos/seed/${index}/300/200`, // Placeholder image
      badgeText,
      badgeVariant,
      isBookmarked: false,
      chipText: activityType,
      companyName: organization,
      title,
      jobs: jobs.length > 0 ? jobs : ['기타'], // Default to '기타' if no jobs are specified
      onBookmarkClick: () => console.log(`Bookmark clicked for ${title}`),
      onCardClick: () => console.log(`Card clicked for ${title}`),
      organization,
      startDate: activityStartDate,
      endDate: activityEndDate,
      isFinished,
      label: activityType,
      saveCount: Math.floor(Math.random() * 100), // Random save count
      viewCount: Math.floor(Math.random() * 1000), // Random view count
      onListClick: () => console.log(`List item clicked for ${title}`),
    };
  });
