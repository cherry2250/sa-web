export type ChatRequest = {
  query: string;
  user: string;
  conversation_id?: string;
  files?: {
    type: string;
    transfer_method: string;
    url: string;
  }[];
  inputs?: Record<string, any>;
  response_mode?: string;
};

export type ChatResponse = {
  // 실제 응답 구조에 맞게 타입 정의
  result: string;
};
export async function sendAgentMessage(
  apiKey: string,
  body: ChatRequest
): Promise<ChatResponse> {
  const response = await fetch("https://api.abclab.ktds.com/v1/chat-messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ API 응답 실패:", response.status, errorText);
    throw new Error("AI Agent API Error");
  }

  // ✅ 스트리밍 응답 파싱
  const reader = response.body?.getReader();
  const decoder = new TextDecoder("utf-8");
  let result = "";

  if (!reader) {
    throw new Error("No readable stream found");
  }

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });

    // 각 줄마다 분리해서 처리 (SSE: data: {...})
    const lines = chunk.split("\n");
    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const json = line.replace("data: ", "").trim();
        if (json === "[DONE]") break;

        try {
          const parsed = JSON.parse(json);
          if (parsed?.text) {
            result += parsed.text; // 🔧 스트리밍된 텍스트 모으기
          }
        } catch (e) {
          console.warn("⚠️ JSON 파싱 실패:", json);
        }
      }
    }
  }

  return { result };
}
