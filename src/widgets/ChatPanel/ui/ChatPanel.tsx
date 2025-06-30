"use client";
import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import styles from "./ChatPanel.module.css";
import { ChatInput } from "@/features/ChatInput";
import { UserIdModal } from "@/features/UserIdModal";
import { LogoIcon } from "@/shared/assets/icons";
import { sendAgentMessageStreaming } from "@/shared/lib/aiAgentApi";
import { useUserStore } from "@/shared/store/userStore";
import { useConversationStore } from "@/shared/store/conversationStore";
import { useMessageStore } from "@/shared/store/messageStore";
import { usePageChange } from "@/shared/hooks/usePageChange";
import { useRefreshDetection } from "@/shared/hooks/useRefreshDetection";
import { usePathname } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import "highlight.js/styles/atom-one-dark.css";

interface ChatPanelProps {
  apiKey: string;
}

export const ChatPanel = ({ apiKey }: ChatPanelProps) => {
  const { userId } = useUserStore();
  const { conversationId, setConversationId } = useConversationStore();
  const {
    messages: storeMessages,
    isLoading: storeLoading,
    clearMessages,
  } = useMessageStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("General");
  const [newMessages, setNewMessages] = useState<
    { role: "user" | "ai"; text: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const messageListRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // 페이지 변경과 새로고침 감지
  usePageChange();
  useRefreshDetection();

  // pathname이 변경될 때 메시지 초기화
  useEffect(() => {
    clearMessages();
    setNewMessages([]);
  }, [pathname, clearMessages]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [newMessages, loading, storeMessages]);

  const handleSend = (message: string) => {
    if (!userId) {
      setIsModalOpen(true);
      return;
    }

    setNewMessages((prev) => [...prev, { role: "user", text: message }]);
    setLoading(true);

    sendAgentMessageStreaming(
      apiKey,
      {
        query: message,
        user: userId,
        conversation_id: conversationId || "", // conversation_id가 있으면 사용, 없으면 빈 문자열
        response_mode: "streaming",
        files: [],
        inputs: {},
      },
      (answer) => {
        // 실시간으로 메시지 업데이트
        setNewMessages((prev) => {
          if (prev.length && prev[prev.length - 1].role === "ai") {
            return [...prev.slice(0, -1), { role: "ai", text: answer }];
          }
          return [...prev, { role: "ai", text: answer }];
        });
      },
      () => setLoading(false),
      () => {
        setNewMessages((prev) => [
          ...prev,
          { role: "ai", text: "에러가 발생했습니다." },
        ]);
        setLoading(false);
      },
      (newConversationId) => {
        setConversationId(newConversationId);
      }
    );
  };

  // 모든 메시지를 하나의 배열로 합치기
  const allMessages = [
    // store에서 가져온 기존 메시지들을 ChatPanel 형식으로 변환
    ...storeMessages
      .map((msg) => [
        { role: "user" as const, text: msg.query },
        { role: "ai" as const, text: msg.answer },
      ])
      .flat()
      .filter((msg) => msg.text), // 빈 텍스트는 제거
    // 새로운 메시지들
    ...newMessages,
  ];

  return (
    <div className={styles.panel}>
      <main className={styles.main}>
        {allMessages.length === 0 ? (
          <div className={styles.centerArea}>
            <Link href="/">
              <LogoIcon className={styles.logo} />
            </Link>
            <h2 className={styles.title}>
              How can we <span className={styles.highlight}>assist</span> you
              today?
            </h2>
            <p className={styles.desc}>
              어떤 도움이 필요하신가요? 궁금한 부분을 질문해주세요!
            </p>
            {!userId ? (
              <div className={styles.userIdSection}>
                <p className={styles.userIdWarning}>
                  💡 사용자 ID를 설정하면 대화를 시작할 수 있습니다.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className={styles.setUserIdButton}
                >
                  사용자 ID 설정
                </button>
              </div>
            ) : (
              <div className={styles.currentUserInfo}>
                <p className={styles.currentUserText}>
                  현재 사용자:{" "}
                  <span className={styles.currentUserId}>{userId}</span>
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className={styles.changeUserIdButton}
                >
                  변경
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.messageList} ref={messageListRef}>
            {storeLoading && (
              <div className={styles.aiMessage} style={{ opacity: 0.7 }}>
                메시지를 불러오는 중...
              </div>
            )}
            {allMessages.map((msg, idx) => (
              <div
                key={idx}
                className={
                  msg.role === "user" ? styles.userMessage : styles.aiMessage
                }
              >
                {msg.role === "ai" ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                      code(props) {
                        const { children, className, ...rest } = props;
                        return (
                          <code className={className} {...rest}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                ) : (
                  msg.text
                )}
              </div>
            ))}
            {loading && (
              <div className={styles.aiMessage} style={{ opacity: 0.7 }}>
                AI 응답 중...
              </div>
            )}
          </div>
        )}
      </main>
      <ChatInput onSend={handleSend} />
      <UserIdModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
