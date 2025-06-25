import { useEffect } from "react";
import { useConversationStore } from "@/shared/store/conversationStore";

export const useRefreshDetection = () => {
  const { clearConversationId } = useConversationStore();

  useEffect(() => {
    const handleBeforeUnload = () => {
      // 페이지를 떠날 때 conversation_id를 clear
      clearConversationId();
    };

    const handlePageShow = (event: PageTransitionEvent) => {
      // 새로고침으로 페이지가 다시 로드될 때 conversation_id를 clear
      if (event.persisted) {
        clearConversationId();
      }
    };

    // 페이지를 떠날 때 (새로고침, 브라우저 닫기 등)
    window.addEventListener("beforeunload", handleBeforeUnload);

    // 페이지가 다시 표시될 때 (새로고침 후)
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [clearConversationId]);
};
