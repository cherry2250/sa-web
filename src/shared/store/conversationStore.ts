import { create } from "zustand";

interface ConversationState {
  conversationId: string;
  setConversationId: (conversationId: string) => void;
  clearConversationId: () => void;
  hasActiveConversation: () => boolean;
  startNewConversation: () => void;
}

export const useConversationStore = create<ConversationState>()((set, get) => ({
  conversationId: "",
  setConversationId: (conversationId: string) => set({ conversationId }),
  clearConversationId: () => set({ conversationId: "" }),
  hasActiveConversation: () => {
    const { conversationId } = get();
    return conversationId !== "";
  },
  startNewConversation: () => {
    set({ conversationId: "" });
    // 페이지 새로고침으로 메시지도 초기화
    window.location.reload();
  },
}));
