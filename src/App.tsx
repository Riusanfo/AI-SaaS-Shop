import { useState } from 'react';
import { Header } from './components/Header/Header';
import { Hero } from './components/Hero/Hero';
import { BuilderPage } from './features/builder/BuilderPage';
import { Benefits } from './components/Benefits/Benefits';
import { Guide } from './components/Guide/Guide';
import { AiSidebar } from './components/AiSidebar/AiSidebar';
import { AuthProvider } from './features/auth/AuthContext';
import { useAuth } from './features/auth/useAuth';
import { AuthModal } from './features/auth/AuthModal';
import { AuthPrompt } from './features/auth/AuthPrompt';
import type { Message } from './types/chat';
import styles from './App.module.css';

function AppContent() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'home' | 'create' | 'benefits' | 'guide'>('home');
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: 'Hi! Im Verity. Your friend is an assistant! Ask anything, I know everything!', timestamp: '12:00' }
  ]);
  const [isThinking, setIsThinking] = useState(false);

  const handleSendMessage = (text: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);

    setTimeout(() => {
      let aiResponse = "I've noted that! Let me help you set up your store.";
      if (text.toLowerCase().includes('export')) {
        aiResponse = "Exporting store configuration... Done! Ready for deployment.";
      } else if (text.toLowerCase().includes('свче') || text.toLowerCase().includes('свеч')) {
        aiResponse = "Свечи — отличный выбор! Я создал структуру каталога и подобрал тёплую палитру.";
      }

      setMessages(prev => [
        ...prev,
        { id: (Date.now() + 1).toString(), sender: 'ai', text: aiResponse, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
      setIsThinking(false);
    }, 1500);
  };

  return (
    <div className={styles.layoutRoot}>
      <div className={`${styles.workspaceColumn} ${isAiOpen ? styles.withSidebar : ''}`}>
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAuth={() => setIsAuthOpen(true)}
        />
        <main className={styles.mainViewport}>
          {activeTab === 'home' && (
            <Hero
              onStart={() => setActiveTab('create')}
              onBenefits={() => setActiveTab('benefits')}
            />
          )}
          {activeTab === 'create' && (
            isLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '320px', color: 'var(--text-secondary)' }}>
                Проверка доступа…
              </div>
            ) : !user ? (
              <AuthPrompt
                type="guest"
                onOpenAuth={() => setIsAuthOpen(true)}
                onGoHome={() => setActiveTab('home')}
              />
            ) : user.role === 'BUYER' ? (
              <AuthPrompt
                type="buyer"
                onOpenAuth={() => setIsAuthOpen(true)}
                onGoHome={() => setActiveTab('home')}
              />
            ) : (
              <BuilderPage />
            )
          )}
          {activeTab === 'benefits' && <Benefits />}
          {activeTab === 'guide' && <Guide />}
        </main>
      </div>

      <AiSidebar
        messages={messages}
        onSendMessage={handleSendMessage}
        isThinking={isThinking}
        isOpen={isAiOpen}
        onToggle={() => setIsAiOpen(prev => !prev)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

