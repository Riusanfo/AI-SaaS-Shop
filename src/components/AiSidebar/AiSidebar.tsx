import { useState } from 'react';
import type { Message } from '../../types/chat';
import styles from './AiSidebar.module.css';

interface AiSidebarProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isThinking: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

export function AiSidebar({ messages, onSendMessage, isThinking, isOpen, onToggle }: AiSidebarProps) {
  const [inputMessage, setInputMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    onSendMessage(inputMessage);
    setInputMessage('');
  };

  return (
    <>
      {!isOpen && (
        <button className={styles.aiFloatingTrigger} onClick={onToggle} aria-label="Открыть чат с ассистентом Verity">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
          </svg>
          <span className={styles.aiTriggerText}>Ассистент Verity</span>
        </button>
      )}

      <aside className={`${styles.aiSidebarDrawer} ${isOpen ? styles.open : styles.closed}`}>
        <div className={styles.aiSidebarHeader}>
          <div className={styles.aiProfileInfo}>
            <div className={styles.aiAvatarBadge}>
              <span className={styles.avatarMonogram}>V</span>
            </div>
            <div>
              <span className={styles.aiName}>Verity Assistant</span>
              <span className={styles.aiSubstatus}>Онлайн</span>
            </div>
          </div>
          <button className={styles.closeSidebarBtn} onClick={onToggle} aria-label="Закрыть панель">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={styles.chatMessages}>
          {messages.map(msg => (
            <div key={msg.id} className={`${styles.chatBubble} ${styles[msg.sender]}`}>
              <p>{msg.text}</p>
              <span className={styles.timestamp}>{msg.timestamp}</span>
            </div>
          ))}
          {isThinking && (
            <div className={`${styles.chatBubble} ${styles.ai} ${styles.thinking}`}>
              <p>Verity думает...</p>
            </div>
          )}
        </div>

        <form className={styles.chatInputForm} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Спросите о настройке магазина..."
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
          />
          <button type="submit" aria-label="Отправить">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </form>
      </aside>
    </>
  );
}
