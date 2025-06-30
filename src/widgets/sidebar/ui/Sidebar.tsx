"use client";
import { LogoIcon } from "@/shared/assets/icons";
import styles from "./Sidebar.module.css";
import Link from "next/link";
import { useConversationStore } from "@/shared/store/conversationStore";
import { useMessageStore } from "@/shared/store/messageStore";
import { useUserStore } from "@/shared/store/userStore";
import { UserIdModal } from "@/features/UserIdModal";
import { GearIcon } from "@/shared/assets/icons";
import React, { useState, useEffect } from "react";
import { getApiKeyByPath } from "@/shared/config/apiKeys";
import { fetchConversations } from "@/shared/lib/fetchMessages";
import { usePathname, useRouter } from "next/navigation";

export const Sidebar = () => {
  const { startNewConversation, setConversationId } = useConversationStore();
  const { fetchMessagesForConversation, clearMessages } = useMessageStore();
  const { userId } = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const apiKey = getApiKeyByPath(pathname);

    if (userId && apiKey) {
      fetchConversations({ apiKey, userId }).then((res) => {
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

  const handleConversationClick = async (convId: string) => {
    const apiKey = getApiKeyByPath(pathname);
    if (userId && apiKey && convId) {
      setConversationId(convId);
      await fetchMessagesForConversation(apiKey, userId, convId);

      let newPath: string;

      if (pathname === "/") {
        newPath = `/${convId}`;
      } else {
        const pathSegments = pathname.split("/").filter(Boolean);
        const lastSegment = pathSegments[pathSegments.length - 1];

        const uuidRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

        if (uuidRegex.test(lastSegment)) {
          pathSegments[pathSegments.length - 1] = convId;
          newPath = `/${pathSegments.join("/")}`;
        } else {
          newPath = `${pathname}/${convId}`;
        }
      }

      router.push(newPath);
    }
  };

  const handleNewChat = () => {
    startNewConversation();
    clearMessages();

    // 현재 경로에서 conversation_id 부분을 제거하고 기본 경로로 이동
    const pathSegments = pathname.split("/").filter(Boolean);
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    console.log("Debug - pathSegments:", pathSegments);

    // 마지막 세그먼트가 UUID인지 확인하고 제거
    if (
      pathSegments.length > 0 &&
      uuidRegex.test(pathSegments[pathSegments.length - 1])
    ) {
      pathSegments.pop(); // 마지막 UUID 제거
      console.log("Debug - UUID removed, remaining segments:", pathSegments);
    }

    // 기본 경로로 이동 (남은 세그먼트가 있으면 그 경로로, 없으면 루트로)
    const newPath =
      pathSegments.length > 0 ? `/${pathSegments.join("/")}` : "/";
    console.log("Debug - redirecting to:", newPath);

    // router.replace를 사용하여 브라우저 히스토리를 교체
    router.replace(newPath);

    // router.replace가 작동하지 않을 경우를 대비하여 window.location 사용
    setTimeout(() => {
      if (window.location.pathname !== newPath) {
        console.log("Debug - router.replace failed, using window.location");
        window.location.href = newPath;
      }
    }, 100);
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
        <div className={styles.chatTitle}>최근 대화 이력</div>
        {conversations.map((conv) => (
          <div
            className={styles.chatItem}
            key={conv.id}
            onClick={() => handleConversationClick(conv.id)}
            style={{ cursor: "pointer" }}
          >
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
