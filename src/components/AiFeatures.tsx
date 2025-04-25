
import React, { useState } from 'react';
import { File, FilePlus, Trash2, Edit, Send } from 'lucide-react';
import { Button } from './ui/button';

interface AiFeaturesProps {
  onNewFile: () => void;
  onDelete: () => void;
  onRename: () => void;
  activeFile: { name: string; extension: string; } | null;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const AiFeatures: React.FC<AiFeaturesProps> = ({
  onNewFile,
  onDelete,
  onRename,
  activeFile
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      content: "Hello! I'm your AI coding assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: `I'll help you analyze "${input}". What would you like to know about this code?`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full border-l border-border bg-sidebar">
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-medium text-foreground">AI Assistant</h3>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${
              message.sender === 'ai' 
                ? 'bg-secondary/50 text-foreground' 
                : 'bg-primary/20 text-foreground ml-auto'
            } p-3 rounded-lg max-w-[80%]`}
          >
            <p className="whitespace-pre-wrap text-sm">{message.content}</p>
            <span className="text-xs text-muted-foreground mt-1 block">
              {new Intl.DateTimeFormat('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              }).format(message.timestamp)}
            </span>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Ask about your code..."
            className="flex-1 bg-background rounded-md p-2 text-sm focus:outline-none"
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={handleSendMessage}
            className="shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 border-t border-border">
        <h4 className="text-sm font-medium text-foreground mb-4">File Actions</h4>
        <div className="flex flex-col gap-2">
          <Button 
            variant="ghost" 
            className="justify-start"
            onClick={onNewFile}
          >
            <FilePlus className="w-4 h-4 mr-2" />
            New File
          </Button>

          <Button 
            variant="ghost" 
            className="justify-start"
            onClick={onDelete}
            disabled={!activeFile}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete File
          </Button>

          <Button 
            variant="ghost" 
            className="justify-start"
            onClick={onRename}
            disabled={!activeFile}
          >
            <Edit className="w-4 h-4 mr-2" />
            Rename File
          </Button>
        </div>

        {activeFile && (
          <div className="pt-4 border-t border-border mt-4">
            <p className="text-xs text-muted-foreground mb-2">Current File</p>
            <div className="flex items-center">
              <File className="w-4 h-4 mr-2 text-muted-foreground" />
              <span className="text-sm">
                {activeFile.name}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiFeatures;
