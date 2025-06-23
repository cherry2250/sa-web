import styles from "./Sidebar.module.css";

export const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>SA-WEB</div>
      <button className={styles.newChatButton}>+ Begin a New Chat</button>
      <input className={styles.search} placeholder="Search" />

      <div className={styles.categoryList}>
        <div className={styles.categoryItem}>General</div>
        <div className={styles.categoryItem}>Sales</div>
        <div className={styles.categoryItem}>Negotiation</div>
        <div className={styles.categoryItem}>Marketing</div>
      </div>

      <div className={styles.recentChats}>
        <div className={styles.chatItem}>How can I increase the...</div>
        <div className={styles.chatItem}>What’s the best approach...</div>
      </div>

      <div className={styles.footer}>
        <span>User Profile</span>
        <span>⚙️</span>
      </div>
    </aside>
  );
};
