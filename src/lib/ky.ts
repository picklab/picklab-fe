import ky, { AfterResponseHook, BeforeRequestHook, Options } from 'ky';

// API_BASE_URL은 이제 Next.js API 라우트에서 사용되므로, 클라이언트 측에서는 필요하지 않습니다.
import { API_BASE_URL } from '@/config/shared';

const handleBeforeRequest: BeforeRequestHook = async () => {};
const handleHttpError: AfterResponseHook = async () => {};

// 프록시 API 클라이언트 생성 함수
const createProxyApiClient = () => {
  const options: Options = {
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 30000,
    prefixUrl: API_BASE_URL, // 모든 요청이 /api/proxy 라우트로 향하도록 설정
    hooks: {
      beforeRequest: [handleBeforeRequest],
      afterResponse: [handleHttpError],
    },
  };

  const kyInstance = ky.create(options);

  return {
    get: <T>(url: string) => kyInstance.get<T>(url).json<T>(),
    post: <TReq, TRes>(url: string, data?: TReq) => kyInstance.post<TRes>(url, { json: data ?? {} }).json<TRes>(),
    postStream: (url: string, data?: unknown): Promise<Response> => kyInstance.post(url, { json: data ?? {} }),
    put: <TReq, TRes>(url: string, data?: TReq) => kyInstance.put<TRes>(url, { json: data ?? {} }).json<TRes>(),
    delete: <TRes>(url: string) => kyInstance.delete<TRes>(url).json<TRes>(),
    patch: <TReq, TRes>(url: string, data?: TReq) => kyInstance.patch<TRes>(url, { json: data ?? {} }).json<TRes>(),
  };
};

export const ProxyApiClient = createProxyApiClient();
// 기존 ApiClient는 더 이상 필요하지 않으므로 제거하거나, 다른 용도로 사용하려면 유지할 수 있습니다.
// export const ApiClient = createApiClient();
