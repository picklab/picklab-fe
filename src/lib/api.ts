/** @format */

import { cookies } from "next/headers";

interface FetchOptions extends RequestInit {
  headers?: HeadersInit;
}

export async function fetchWithAuth(url: string, options?: FetchOptions) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const headers = new Headers(options?.headers);
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return fetch(url, { ...options, headers });
}
