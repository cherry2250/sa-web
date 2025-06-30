"use client";
import { ChatPanel } from "@/widgets/ChatPanel/ui/ChatPanel";
import { getApiKeyByPath } from "@/shared/config/apiKeys";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useConversationStore } from "@/shared/store/conversationStore";
import { useMessageStore } from "@/shared/store/messageStore";
import { useUserStore } from "@/shared/store/userStore";

export default function DynamicPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string[];

  // slug 배열에서 conversationId 추출
  const conversationId = slug[slug.length - 1];

  // 전체 경로를 pathname으로 재구성
  const pathname = `/${slug.join("/")}`;

  const { setConversationId } = useConversationStore();
  const { fetchMessagesForConversation } = useMessageStore();
  const { userId } = useUserStore();

  useEffect(() => {
    // conversationId가 유효한 UUID인지 확인
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(conversationId)) {
      // 유효하지 않은 conversationId인 경우 기본 경로로 리다이렉트
      const pathSegments = slug.filter((segment) => !uuidRegex.test(segment));
      const redirectPath =
        pathSegments.length > 0 ? `/${pathSegments.join("/")}` : "/";
      router.replace(redirectPath);
      return;
    }

    if (conversationId && userId) {
      // conversationId를 store에 설정
      setConversationId(conversationId);

      // 해당 대화의 메시지를 로드
      const apiKey = getApiKeyByPath(pathname);
      if (apiKey) {
        fetchMessagesForConversation(apiKey, userId, conversationId);
      }
    }
  }, [
    conversationId,
    userId,
    pathname,
    setConversationId,
    fetchMessagesForConversation,
    slug,
    router,
  ]);

  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ChatPanel apiKey={getApiKeyByPath(pathname)} />
    </div>
  );
}
