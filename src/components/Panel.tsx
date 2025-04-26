import React, { useState } from 'react';
import { Terminal } from './Terminal';
import { ChevronDown, ChevronUp, X, Maximize2, SplitSquareVertical, LayoutGrid, FileText, Close } from 'lucide-react';

type PanelTab = {
  id: string;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
  filePath?: string;
};

const Panel: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('terminal');
  const [isMaximized, setIsMaximized] = useState(false);
  const [isSplit, setIsSplit] = useState(false);

  const tabs: PanelTab[] = [
    {
      id: 'terminal',
      label: 'Terminal',
      icon: <SplitSquareVertical className="w-4 h-4" />,
      component: <Terminal />,
      filePath: 'Terminal'
    },
    {
      id: 'problems',
      label: 'Problems',
      icon: <span className="text-yellow-500">⚠️</span>,
      component: <div className="p-4">Problems view content</div>,
      filePath: 'Problems'
    },
    {
      id: 'output',
      label: 'Output',
      icon: <span className="text-blue-500">📝</span>,
      component: <div className="p-4">Output view content</div>,
      filePath: 'Output'
    },
    {
      id: 'debug',
      label: 'Debug Console',
      icon: <span className="text-green-500">🐛</span>,
      component: <div className="p-4">Debug Console content</div>,
      filePath: 'Debug Console'
    }
  ];

  const togglePanel = () => {
    setIsVisible(!isVisible);
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const toggleSplit = () => {
    setIsSplit(!isSplit);
  };

  const closeTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    // Handle tab closing logic here
    console.log(`Closing tab: ${tabId}`);
  };

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div 
      className={`flex flex-col transition-all duration-200 ${
        isVisible 
          ? isMaximized 
            ? 'h-[calc(100vh-2rem)]' 
            : 'h-48' 
          : 'h-6'
      }`}
    >
      <div className="flex items-center justify-between px-2 py-1 bg-[#2d2d2d] border-t border-[#3d3d3d]">
        <div className="flex items-center space-x-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`px-2 py-1 rounded flex items-center space-x-1 text-xs group ${
                activeTab === tab.id 
                  ? 'bg-[#3d3d3d] text-white' 
                  : 'text-[#cccccc] hover:bg-[#3d3d3d]'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <button
                className="opacity-0 group-hover:opacity-100 ml-1 p-0.5 hover:bg-[#4d4d4d] rounded"
                onClick={(e) => closeTab(e, tab.id)}
                title="Close"
              >
                <Close className="w-3 h-3" />
              </button>
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          {activeTabData && (
            <div className="flex items-center text-xs text-[#cccccc] px-2">
              <FileText className="w-3 h-3 mr-1" />
              <span>{activeTabData.filePath}</span>
            </div>
          )}
          <div className="h-4 w-px bg-[#3d3d3d] mx-1" />
          <button
            className="p-1 hover:bg-[#3d3d3d] rounded text-[#cccccc]"
            onClick={toggleSplit}
            title={isSplit ? "Join Views" : "Split View"}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            className="p-1 hover:bg-[#3d3d3d] rounded text-[#cccccc]"
            onClick={toggleMaximize}
            title={isMaximized ? "Restore Down" : "Maximize"}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            className="p-1 hover:bg-[#3d3d3d] rounded text-[#cccccc]"
            onClick={togglePanel}
            title={isVisible ? "Hide Panel" : "Show Panel"}
          >
            {isVisible ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>
      <div className={`flex-1 bg-[#1e1e1e] overflow-auto ${!isVisible ? 'hidden' : ''}`}>
        {isSplit ? (
          <div className="grid grid-cols-2 h-full">
            <div className="border-r border-[#3d3d3d]">
              {tabs.find(tab => tab.id === activeTab)?.component}
            </div>
            <div>
              {tabs.find(tab => tab.id === activeTab)?.component}
            </div>
          </div>
        ) : (
          tabs.find(tab => tab.id === activeTab)?.component
        )}
      </div>
    </div>
  );
};

export default Panel;