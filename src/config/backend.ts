// 백엔드 주소. 환경 변수가 없을 때의 기본값은 기존 코드와 같은 개발 서버 주소다.
const DEFAULT_BACKEND_URL = 'http://161.153.21.86:8080';

/** 서버(route handler, 서버 컴포넌트)에서 백엔드를 호출할 때 쓴다. */
export const BACKEND_URL = process.env.EXTERNAL_API_BASE_URL || DEFAULT_BACKEND_URL;

/**
 * 브라우저가 백엔드로 직접 이동해야 하는 곳(소셜 로그인 시작)에서 쓴다.
 * 클라이언트 번들에 값이 들어가려면 NEXT_PUBLIC_ 접두사가 필요하다.
 */
export const PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || DEFAULT_BACKEND_URL;
