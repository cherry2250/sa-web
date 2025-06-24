import { LogoIcon } from "@/shared/assets/icons";
import styles from "./Sidebar.module.css";
import Link from "next/link";

export const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <a href={"/"}>
        <div className={styles.logoTitleRow}>
          <LogoIcon className={styles.logo} />
          <span className={styles.title}>SA-WEB</span>
        </div>
      </a>
      <button className={styles.newChatButton}>+ Begin a New Chat</button>
      <input className={styles.search} placeholder="Search" />
      <hr></hr>
      <div className={styles.recentChats}>
        <div className={styles.chatItem}>최근 대화 이력</div>
        <div className={styles.chatItem}>What’s the best approach...</div>
      </div>

      <div className={styles.footer}>
        <span>User Profile</span>
        <span>⚙️</span>
      </div>
    </aside>
  );
};
