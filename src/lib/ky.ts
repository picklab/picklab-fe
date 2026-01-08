import ky, { AfterResponseHook, BeforeRequestHook, Options } from 'ky';

import { API_BASE_URL } from '@/config/shared';

const handleBeforeRequest: BeforeRequestHook = async () => {};
const handleHttpError: AfterResponseHook = async () => {};

const createApiClient = () => {
  const options: Options = {
    headers: {
      'Content-Type': 'application/json',
    },

    timeout: 30000,
    prefixUrl: API_BASE_URL,
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

export const ApiClient = createApiClient();
