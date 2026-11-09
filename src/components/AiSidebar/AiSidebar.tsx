import { useState } from 'react';
import styles from './AiSidebar.module.css';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

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
        <button className={styles.aiFloatingTrigger} onClick={onToggle} aria-label="Открыть чат с ИИ Verity">
          <span className={styles.aiTriggerIcon}>✨</span>
          <span className={styles.aiTriggerText}>ИИ Verity</span>
          <span className={styles.aiTriggerPulse}></span>
        </button>
      )}

      <aside className={`${styles.aiSidebarDrawer} ${isOpen ? styles.open : styles.closed}`}>
        <div className={styles.aiSidebarHeader}>
          <div className={styles.aiProfileInfo}>
            <div className={styles.aiAvatarBadge}>✨</div>
            <div>
              <span className={styles.aiName}>Verity AI Assistant</span>
              <span className={styles.aiSubstatus}>Online & Ready</span>
            </div>
          </div>
          <button className={styles.closeSidebarBtn} onClick={onToggle} aria-label="Закрыть панель ИИ">
            ✕
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
              <p>Verity thinking... 6s</p>
            </div>
          )}
        </div>

        <form className={styles.chatInputForm} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Спросите ИИ о чем угодно..."
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
          />
          <button type="submit" aria-label="Отправить">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </form>
      </aside>
    </>
  );
}
