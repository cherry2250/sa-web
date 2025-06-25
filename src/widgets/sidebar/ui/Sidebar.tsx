"use client";
import { LogoIcon } from "@/shared/assets/icons";
import styles from "./Sidebar.module.css";
import Link from "next/link";
import { useConversationStore } from "@/shared/store/conversationStore";
import { useUserStore } from "@/shared/store/userStore";
import { UserIdModal } from "@/features/UserIdModal";
import { GearIcon } from "@/shared/assets/icons";
import React, { useState, useEffect } from "react";
import { getApiKeyByPath } from "@/shared/config/apiKeys";
import { fetchConversations } from "@/shared/lib/fetchMessages";
import { usePathname } from "next/navigation";

export const Sidebar = () => {
  const { startNewConversation, conversationId } = useConversationStore();
  const { userId } = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    const apiKey = getApiKeyByPath(pathname);
    console.log("Debug - pathname:", pathname);
    console.log("Debug - userId:", userId);
    console.log("Debug - apiKey:", apiKey);

    if (userId && apiKey) {
      console.log("Debug - Attempting API call with:", { userId, apiKey });
      fetchConversations({ apiKey, userId }).then((res) => {
        console.log("Debug - API Response:", res);
        if (res && Array.isArray(res.data)) {
          setConversations(res.data);
        } else {
          setConversations([]);
        }
      });
    } else {
      console.log("Debug - API call skipped. Missing required values.");
    }
  }, [userId, pathname]);

  const handleNewChat = () => {
    startNewConversation();
  };

  return (
    <aside className={styles.sidebar}>
      <a href={"/"}>
        <div className={styles.logoTitleRow}>
          <LogoIcon className={styles.logo} />
          <span className={styles.title}>SA-WEB</span>
        </div>
      </a>
      <button className={styles.newChatButton} onClick={handleNewChat}>
        + Begin a New Chat
      </button>
      {/* <input className={styles.search} placeholder="Search" /> */}
      <hr></hr>
      <div className={styles.recentChats}>
        <div>최근 대화 이력</div>
        {conversations.map((conv) => (
          <div className={styles.chatItem} key={conv.id}>
            {conv.name || conv.id}
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <span>{userId ? "접속 ID : " + userId : "ID를 입력해주세요"}</span>
        <button
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            marginLeft: 8,
          }}
          onClick={() => setIsModalOpen(true)}
          aria-label="사용자 변경 또는 등록"
        >
          <GearIcon width={20} height={20} />
        </button>
        <UserIdModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </aside>
  );
};
