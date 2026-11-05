import { useState } from 'react';
import { Header } from './components/Header/Header';
import { Hero } from './components/Hero/Hero';
import { StoreCreator } from './components/StoreCreator/StoreCreator';
import { Benefits } from './components/Benefits/Benefits';
import { Guide } from './components/Guide/Guide';
import { AiSidebar } from './components/AiSidebar/AiSidebar';
import './App.css';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'create' | 'benefits' | 'guide'>('home');
  const [isAiOpen, setIsAiOpen] = useState(true);
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
    <div className="layoutRoot">
      <div className="workspaceColumn">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="mainViewport">
          {activeTab === 'home' && (
            <Hero
              onStart={() => setActiveTab('create')}
              onBenefits={() => setActiveTab('benefits')}
            />
          )}
          {activeTab === 'create' && <StoreCreator />}
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
    </div>
  );
}
