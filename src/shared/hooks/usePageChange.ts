import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useConversationStore } from "@/shared/store/conversationStore";

export const usePageChange = () => {
  const pathname = usePathname();
  const { clearConversationId } = useConversationStore();

  useEffect(() => {
    // 페이지가 변경될 때마다 conversation_id를 clear
    clearConversationId();
  }, [pathname, clearConversationId]);
};
