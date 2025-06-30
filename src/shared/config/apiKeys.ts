// API Keys for different pages
// 환경변수에서 가져와야 합니다
export const API_KEYS = {
  KOS_SA: process.env.NEXT_PUBLIC_KOS_SA_API_KEY,
  K_ICIS_SA: process.env.NEXT_PUBLIC_K_ICIS_SA_API_KEY,
  CM: process.env.NEXT_PUBLIC_CM_API_KEY,
  B_MON: process.env.NEXT_PUBLIC_B_MON_API_KEY,
  B_OS: process.env.NEXT_PUBLIC_B_OS_API_KEY,
} as const;

export type ApiKeyType = keyof typeof API_KEYS;

// API Key가 설정되지 않은 경우 에러를 발생시키는 함수
export const getApiKey = (key: ApiKeyType): string => {
  const apiKey = API_KEYS[key];
  if (!apiKey) {
    throw new Error(
      `${key}의 API KEY를 확인할 수 없습니다. ${getEnvVarName(
        key
      )} env 파일을 확인하시기 바랍니다.`
    );
  }
  return apiKey;
};

// 환경변수 이름을 반환하는 함수
const getEnvVarName = (key: ApiKeyType): string => {
  const envVarMap = {
    KOS_SA: "NEXT_PUBLIC_KOS_SA_API_KEY",
    K_ICIS_SA: "NEXT_PUBLIC_K_ICIS_SA_API_KEY",
    CM: "NEXT_PUBLIC_CM_API_KEY",
    B_MON: "NEXT_PUBLIC_B_MON_API_KEY",
    B_OS: "NEXT_PUBLIC_B_OS_API_KEY",
  };
  return envVarMap[key];
};

export function getApiKeyByPath(pathname: string) {
  if (pathname.startsWith("/b-mon")) return getApiKey("B_MON");
  if (pathname.startsWith("/b-os")) return getApiKey("B_OS");
  if (pathname.startsWith("/k-icis-sa")) return getApiKey("K_ICIS_SA");
  if (pathname.startsWith("/cm")) return getApiKey("CM");
  return getApiKey("KOS_SA");
}
