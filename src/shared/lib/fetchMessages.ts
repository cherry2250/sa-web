import { getApiUrl } from "@/shared/config/apiConfig";

export async function fetchMessages({
  apiKey,
  userId,
  conversationId,
  firstId = null,
  limit = 20,
}: {
  apiKey: string;
  userId: string;
  conversationId: string;
  firstId?: string | null;
  limit?: number;
}) {
  try {
    const params = new URLSearchParams();
    params.append("user", userId);
    params.append("conversation_id", conversationId);
    if (firstId) params.append("first_id", firstId);
    params.append("limit", String(limit));

    const res = await fetch(`${getApiUrl("messages")}?${params.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    const data = await res.json();
    console.log("최근 대화 이력 응답:", data);
    return data;
  } catch (err) {
    console.error("최근 대화 이력 호출 에러:", err);
    return null;
  }
}

export async function fetchConversations({
  apiKey,
  userId,
  lastId = null,
  limit = 20,
  pinned = undefined,
}: {
  apiKey: string;
  userId: string;
  lastId?: string | null;
  limit?: number;
  pinned?: boolean;
}) {
  try {
    const params = new URLSearchParams();
    params.append("user", userId);
    if (lastId) params.append("last_id", lastId);
    params.append("limit", String(limit));
    if (typeof pinned === "boolean") params.append("pinned", String(pinned));

    const res = await fetch(
      `${getApiUrl("conversations")}?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );
    const data = await res.json();
    console.log("대화 목록 응답:", data);
    return data;
  } catch (err) {
    console.error("대화 목록 호출 에러:", err);
    return null;
  }
}
