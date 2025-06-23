"use client";
import React from "react";
import styles from "./ChatInput.module.css";
import { PaperClipIcon, MicIcon, SendIcon } from "@/shared/assets/icons";

export const ChatInput = () => (
  <div className={styles.inputWrap}>
    <button className={`${styles.iconBtn} ${styles.leftIcon}`}>
      <PaperClipIcon width={24} height={24} />
    </button>
    <input
      type="text"
      placeholder="type your prompt here"
      className={styles.input}
    />
    <div className={`${styles.iconBtn} ${styles.rightIcons}`}>
      <button className={styles.iconBtn}>
        <MicIcon width={24} height={24} />
      </button>
      <button className={styles.sendBtn}>
        <SendIcon
          width={24}
          height={24}
          style={{ transform: "rotate(-45deg)" }}
        />
      </button>
    </div>
  </div>
);
