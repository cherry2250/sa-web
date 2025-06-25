# API Key 설정 가이드

## 환경변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음과 같이 API Key를 설정하세요:

```bash
# API Base URL
NEXT_PUBLIC_API_BASE_URL=https://api.abclab.ktds.com/v1

# API Keys for different pages
NEXT_PUBLIC_KOS_SA_API_KEY=app-kp12R0vDySbir5GhcEexZm2m
NEXT_PUBLIC_K_ICIS_SA_API_KEY=app-kp12R0vDySbir5GhcEexZm2m
NEXT_PUBLIC_CM_API_KEY=app-kp12R0vDySbir5GhcEexZm2m
NEXT_PUBLIC_B_MON_API_KEY=app-kp12R0vDySbir5GhcEexZm2m
NEXT_PUBLIC_B_OS_API_KEY=app-kp12R0vDySbir5GhcEexZm2m
```

## API 설정

### Base URL

- **환경변수**: `NEXT_PUBLIC_API_BASE_URL`
- **기본값**: `https://api.abclab.ktds.com/v1`
- **설명**: API 서버의 기본 주소

### Endpoints

- **Chat Messages**: `/chat-messages`
- **전체 URL**: `https://api.abclab.ktds.com/v1/chat-messages`

## 각 페이지별 API Key 매핑

- **메인 페이지 (/)**: `NEXT_PUBLIC_KOS_SA_API_KEY`
- **KOS-SA 페이지 (/kos-sa)**: `NEXT_PUBLIC_KOS_SA_API_KEY`
- **K-ICIS-SA 페이지 (/k-icis-sa)**: `NEXT_PUBLIC_K_ICIS_SA_API_KEY`
- **형상관리(CM) 페이지 (/cm)**: `NEXT_PUBLIC_CM_API_KEY`
- **B-MON 페이지 (/b-mon)**: `NEXT_PUBLIC_B_MON_API_KEY`
- **B-OS 페이지 (/b-os)**: `NEXT_PUBLIC_B_OS_API_KEY`

## 보안 강화

1. **`.env.local` 파일은 절대 Git에 커밋하지 마세요**

   - 이 파일은 이미 `.gitignore`에 포함되어 있습니다
   - API Key가 코드에 하드코딩되지 않도록 했습니다

2. **실제 API Key는 안전한 방법으로 관리하세요**

   - 위의 예시 값들을 실제 API Key로 교체하세요
   - 각 환경(개발/스테이징/프로덕션)별로 다른 API Key 사용

3. **환경변수 설정 확인**
   - 환경변수가 설정되지 않으면 애플리케이션이 에러를 발생시킵니다
   - 개발 시작 전에 반드시 `.env.local` 파일을 생성하세요

## 설정 방법

1. 프로젝트 루트에 `.env.local` 파일 생성
2. 위의 환경변수들을 실제 API Key로 설정
3. 개발 서버 재시작
4. 각 페이지에서 올바른 API Key가 사용되는지 확인

## 문제 해결

환경변수가 설정되지 않은 경우 다음과 같은 에러가 발생합니다:

```
Error: API Key for KOS_SA is not configured. Please set NEXT_PUBLIC_KOS_SA_API_KEY in your .env.local file.
```

이 경우 `.env.local` 파일을 확인하고 올바른 API Key를 설정하세요.
