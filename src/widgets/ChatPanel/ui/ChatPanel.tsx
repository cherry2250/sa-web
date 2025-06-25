"use client";
import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import styles from "./ChatPanel.module.css";
import { ChatInput } from "@/features/ChatInput";
import { LogoIcon } from "@/shared/assets/icons";
import { sendAgentMessageStreaming } from "@/shared/lib/aiAgentApi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import "highlight.js/styles/atom-one-dark.css";

const user = "test1234";

interface ChatPanelProps {
  apiKey: string;
}

export const ChatPanel = ({ apiKey }: ChatPanelProps) => {
  const [activeTab, setActiveTab] = useState("General");
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; text: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = (message: string) => {
    setMessages((prev) => [...prev, { role: "user", text: message }]);
    setLoading(true);

    sendAgentMessageStreaming(
      apiKey,
      {
        query: message,
        user,
        conversation_id: "",
        response_mode: "streaming",
        files: [],
        inputs: {},
      },
      (answer) => {
        // 실시간으로 메시지 업데이트
        setMessages((prev) => {
          if (prev.length && prev[prev.length - 1].role === "ai") {
            return [...prev.slice(0, -1), { role: "ai", text: answer }];
          }
          return [...prev, { role: "ai", text: answer }];
        });
      },
      () => setLoading(false),
      () => {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            text: "오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
          },
        ]);
        setLoading(false);
      }
    );
  };

  return (
    <div className={styles.panel}>
      <main className={styles.main}>
        {messages.length === 0 ? (
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
          </div>
        ) : (
          <div className={styles.messageList} ref={messageListRef}>
            {messages.map((msg, idx) => (
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
    </div>
  );
};
