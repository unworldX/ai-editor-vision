
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { mockAiMessages, Message } from '../utils/mockData';

const AiPanel: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(mockAiMessages);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setInput('');

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: `I'll help you with "${input}". What specifically would you like to know?`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  // Format code in messages
  const formatMessage = (content: string) => {
    if (content.includes('```')) {
      const parts = content.split('```');
      return (
        <>
          {parts.map((part, i) => {
            if (i % 2 === 0) {
              return <p key={i} className="whitespace-pre-wrap">{part}</p>;
            } else {
              const codeType = part.split('\n')[0];
              const code = part.substring(codeType.length);
              return (
                <pre key={i} className="bg-secondary/50 p-3 rounded-md my-2 overflow-x-auto text-sm">
                  <code>{code}</code>
                </pre>
              );
            }
          })}
        </>
      );
    }
    return <p className="whitespace-pre-wrap">{content}</p>;
  };

  return (
    <div className="w-80 h-full bg-sidebar border-l border-border flex flex-col">
      <div className="p-2 border-b border-border">
        <h3 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">AI Assistant</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${message.sender === 'ai' ? 'pr-4' : 'pl-4'}`}
          >
            <div
              className={`p-3 rounded-lg ${
                message.sender === 'ai'
                  ? 'bg-secondary/50 text-foreground'
                  : 'bg-primary/20 text-foreground ml-auto'
              }`}
            >
              {formatMessage(message.content)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {new Intl.DateTimeFormat('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              }).format(message.timestamp)}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-3 border-t border-border">
        <div className="flex items-center bg-secondary/50 rounded-md">
          <input
            className="flex-1 bg-transparent p-2 focus:outline-none text-sm"
            placeholder="Ask AI for help..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <button 
            className="p-2 text-muted-foreground hover:text-primary"
            onClick={handleSendMessage}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiPanel;
