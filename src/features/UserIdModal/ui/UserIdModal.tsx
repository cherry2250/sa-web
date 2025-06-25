"use client";
import React, { useState, useEffect } from "react";
import { useUserStore } from "@/shared/store/userStore";
import styles from "./UserIdModal.module.css";

interface UserIdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserIdModal = ({ isOpen, onClose }: UserIdModalProps) => {
  const { userId, setUserId } = useUserStore();
  const [inputValue, setInputValue] = useState(userId);

  useEffect(() => {
    if (isOpen) {
      setInputValue(userId);
    }
  }, [isOpen, userId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setUserId(inputValue.trim());
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>사용자 ID 설정</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="userId" className={styles.label}>
              사용자 ID
            </label>
            <input
              id="userId"
              type="text"
              placeholder="사용자 ID를 입력하세요"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className={styles.input}
              autoFocus
            />
          </div>
          <div className={styles.buttons}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              취소
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={!inputValue.trim()}
            >
              설정
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
