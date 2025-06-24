"use client";
import React, { useState } from "react";
import styles from "./ChatInput.module.css";
import { PaperClipIcon, MicIcon, SendIcon } from "@/shared/assets/icons";

type ChatInputProps = {
  onSend: (message: string) => void;
};

export const ChatInput = ({ onSend }: ChatInputProps) => {
  const [input, setInput] = useState("");

  const handleSend = (value: string) => {
    if (!value.trim()) return;
    onSend(value);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend(input);
    }
  };

  return (
    <div className={styles.inputWrap}>
      <button className={`${styles.iconBtn} ${styles.leftIcon}`} tabIndex={-1}>
        <PaperClipIcon width={20} height={20} />
      </button>
      <input
        type="text"
        placeholder="type your prompt here"
        className={styles.input}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className={styles.rightIcons}>
        <button className={styles.iconBtn} tabIndex={-1}>
          <MicIcon width={20} height={20} />
        </button>
        <button
          className={styles.sendBtn}
          onClick={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
        >
          <SendIcon
            width={20}
            height={20}
            style={{ transform: "rotate(-45deg)" }}
          />
        </button>
      </div>
    </div>
  );
};
