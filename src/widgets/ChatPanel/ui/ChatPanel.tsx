"use client";
import React, { useState } from "react";
import styles from "./ChatPanel.module.css";
import { ChatInput } from "@/features/ChatInput";
import { LogoIcon } from "@/shared/assets/icons";
import { sendAgentMessage } from "@/shared/lib/aiAgentApi";

const apiKey = "app-kp12R0vDySbir5GhcEexZm2m";
const user = "test1234";

export const ChatPanel = () => {
  const [activeTab, setActiveTab] = useState("General");
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; text: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (message: string) => {
    setMessages((prev) => [...prev, { role: "user", text: message }]);
    setLoading(true);

    console.log("📨 handleSend called with:", message);

    try {
      const res = await sendAgentMessage(apiKey, {
        query: message,
        user,
        conversation_id: "",
        response_mode: "streaming",
        files: [],
        inputs: {},
      });
      if (res && res.result) {
        setMessages((prev) => [...prev, { role: "ai", text: res.result }]);
      } else {
        setMessages((prev) => [...prev, { role: "ai", text: res.result }]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "에러가 발생했습니다.222" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.panel}>
      <main className={styles.main}>
        <div style={{ textAlign: "center" }}>
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

        <div style={{ margin: "32px auto", maxWidth: 600 }}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                textAlign: msg.role === "user" ? "right" : "left",
                margin: "8px 0",
                color: msg.role === "user" ? "#a78bfa" : "#fff",
              }}
            >
              {msg.text}
            </div>
          ))}
          {loading && <div style={{ color: "#aaa" }}>AI 응답 중...</div>}
        </div>
      </main>
      <ChatInput onSend={handleSend} />
    </div>
  );
};
