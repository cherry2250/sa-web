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

export async function sendAgentMessageStreaming(
  apiKey: string,
  body: any,
  onMessage: (answer: string) => void,
  onEnd?: () => void,
  onError?: (err: any) => void
) {
  try {
    console.log("bpdy ", JSON.stringify(body));
    const response = await fetch(
      "https://api.abclab.ktds.com/v1/chat-messages",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.body) throw new Error("No response body");

    const reader = response.body.getReader();
    let aiMessage = "";
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (value) {
        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split("\n\n").filter(Boolean);
        for (const line of lines) {
          if (line.startsWith("data:")) {
            const jsonStr = line.replace(/^data:\s*/, "");
            if (jsonStr.trim() === "[DONE]") continue;
            try {
              const eventObj = JSON.parse(jsonStr);
              if (eventObj.conversation_id) {
                console.log("대화 ID:", eventObj.conversation_id);
                // 필요하다면 상태로 저장해서 다음 요청에 사용
              }
              if (eventObj.event === "message" && eventObj.answer) {
                aiMessage += eventObj.answer;
                onMessage(aiMessage);
              }
              if (eventObj.event === "message_end" && onEnd) {
                onEnd();
              }
            } catch (e) {
              // JSON 파싱 에러 무시
            }
          }
        }
      }
    }
  } catch (err) {
    if (onError) onError(err);
  }
}
