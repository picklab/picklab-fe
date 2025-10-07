// 부모 카테고리 타입
export type JobParent = '기획' | '디자인' | '개발' | '마케팅' | 'AI';

// 하위 항목은 화면 표시용 label + 내부 사용용 value(slug)
export interface JobChild {
  label: string;
  value: string;
}

export interface SignupData {
  terms: {
    all: boolean;
    age: boolean;
    service: boolean;
    privacy: boolean;
    marketing: boolean;
  };
  userInfo: {
    name: string;
    education: string;
    schoolName: string;
    major: string;
    graduationStatus: string;
    employmentStatus: string;
    companyName: string;
  };
  interests: string[];
}

export interface StepProps {
  signupData: SignupData;
  setSignupData: React.Dispatch<React.SetStateAction<SignupData>>;
}
