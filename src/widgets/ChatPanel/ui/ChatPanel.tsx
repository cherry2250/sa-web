"use client";
import React, { useState } from "react";
import styles from "./ChatPanel.module.css";
import { ChatInput } from "@/features/ChatInput";
import { LogoIcon } from "@/shared/assets/icons";
import { sendAgentMessageStreaming } from "@/shared/lib/aiAgentApi";

const apiKey = "app-kp12R0vDySbir5GhcEexZm2m";
const user = "test1234";

export const ChatPanel = () => {
  const [activeTab, setActiveTab] = useState("General");
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; text: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const handleSend = (message: string) => {
    setMessages((prev) => [...prev, { role: "user", text: message }]);
    setLoading(true);

    sendAgentMessageStreaming(
      apiKey,
      {
        query: message,
        user,
        conversation_id: "daf68fdf-95d0-4e8b-96a9-bef7910c6504",
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
          { role: "ai", text: "에러가 발생했습니다." },
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
            <LogoIcon className={styles.logo} />
            <h2 className={styles.title}>
              How can we <span className={styles.highlight}>assist</span> you
              today?
            </h2>
            <p className={styles.desc}>
              Get expert guidance powered by AI agents specializing in Sales,
              Marketing, and Negotiation. Choose the agent that suits your needs
              and start your conversation with ease.
            </p>
          </div>
        ) : (
          <div className={styles.messageList}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={
                  msg.role === "user" ? styles.userMessage : styles.aiMessage
                }
              >
                {msg.text}
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
