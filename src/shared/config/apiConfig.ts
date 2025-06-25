// API Configuration
export const API_CONFIG = {
  BASE_URL:
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.abclab.ktds.com/v1",
  ENDPOINTS: {
    CHAT_MESSAGES: "chat-messages",
  },
} as const;

// API URL 생성 함수
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}/${endpoint}`;
};

// API Key가 설정되지 않은 경우 에러를 발생시키는 함수
export const getApiBaseUrl = (): string => {
  const baseUrl = API_CONFIG.BASE_URL;
  if (!baseUrl) {
    throw new Error(
      "API Base URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL in your .env.local file."
    );
  }
  return baseUrl;
};
