import { create } from "zustand";
import { fetchMessages } from "@/shared/lib/fetchMessages";

interface MessageState {
  messages: any[];
  isLoading: boolean;
  fetchMessagesForConversation: (
    apiKey: string,
    userId: string,
    conversationId: string
  ) => Promise<void>;
  clearMessages: () => void;
}

export const useMessageStore = create<MessageState>()((set) => ({
  messages: [],
  isLoading: false,
  fetchMessagesForConversation: async (
    apiKey: string,
    userId: string,
    conversationId: string
  ) => {
    set({ isLoading: true });
    try {
      console.log(
        "Debug - Fetching messages for conversation:",
        conversationId
      );
      const res = await fetchMessages({ apiKey, userId, conversationId });
      console.log("Debug - Messages response:", res);
      if (res && Array.isArray(res.data)) {
        set({ messages: res.data });
      } else {
        set({ messages: [] });
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      set({ messages: [] });
    } finally {
      set({ isLoading: false });
    }
  },
  clearMessages: () => set({ messages: [] }),
}));
