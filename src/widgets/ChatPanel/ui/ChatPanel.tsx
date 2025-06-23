"use client";
import React, { useState } from "react";
import styles from "./ChatPanel.module.css";
import { ChatInput } from "@/features/ChatInput";
import { LogoIcon, MenuIcon } from "@/shared/assets/icons";

const TABS = ["General", "Sales", "Negotiation", "Marketing"];

export const ChatPanel = () => {
  const [activeTab, setActiveTab] = useState("General");

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
      </main>

      <ChatInput />
    </div>
  );
};
