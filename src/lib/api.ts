import { getSession } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestOptions {
  method?: RequestMethod;
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
  requiresAuth?: boolean;
}

interface ApiSuccessResponse<T> {
  success: true;
  code: string;
  data: T;
}

interface ApiErrorResponse {
  success: false;
  code: string;
  message: string;
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const { method = 'GET', headers = {}, body, requiresAuth = false } = options;

  // 기본 헤더 설정
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // 인증이 필요한 경우 헤더에 토큰 추가
  if (requiresAuth && !headers['Authorization']) {
    try {
      const session = await getSession();
      const token = session?.user?.accessToken;
      if (!token) {
        return {
          success: false,
          code: 'AUTH_TOKEN_MISSING',
          message: '인증 토큰이 없습니다.',
        };
      }
      requestHeaders['Authorization'] = `Bearer ${token}`;
    } catch (error) {
      console.error('[API] Failed to get session:', error);
      return {
        success: false,
        code: 'SESSION_ERROR',
        message: '세션 정보를 가져오지 못했습니다.',
      };
    }
  }

  // 요청 옵션 구성
  const requestOptions: RequestInit = {
    method,
    headers: requestHeaders,
    credentials: 'include', // 쿠키 포함
  };

  // GET 요청이 아닌 경우 body 추가
  if (method !== 'GET' && body) {
    requestOptions.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);
    const result: ApiResponse<T> = await response.json();

    console.log('uri:', `${API_BASE_URL}${endpoint}`);

    if (!response.ok || !result.success) {
      const errorResult = result as ApiErrorResponse;
      console.error('[API] Request failed:', {
        endpoint,
        code: errorResult.code,
        message: errorResult.message,
      });
      return errorResult;
    }
    console.log('[API] Request succeeded:', { endpoint, result });

    return result as ApiSuccessResponse<T>;
  } catch (error) {
    console.error('[API] Network error:', { endpoint, error });
    return {
      success: false,
      code: 'NETWORK_ERROR',
      message: '네트워크 오류가 발생했습니다.',
    };
  }
}
