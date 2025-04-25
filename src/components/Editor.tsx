
import React, { useEffect, useRef } from 'react';
import { OpenFile } from '../utils/mockData';

interface EditorProps {
  file?: OpenFile;
}

const Editor: React.FC<EditorProps> = ({ file }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  // Simple syntax highlighting function
  const highlightSyntax = (content: string): string => {
    let highlighted = content
      .replace(/\n/g, '</div><div class="line-number">')
      .replace(/(import|export|const|let|function|return|if|else|for|while)/g, '<span class="token keyword">$1</span>')
      .replace(/('.*?'|".*?")/g, '<span class="token string">$1</span>')
      .replace(/(\w+)(?=\()/g, '<span class="token function">$1</span>')
      .replace(/(\/\/.*)/g, '<span class="token comment">$1</span>')
      .replace(/(\d+)/g, '<span class="token number">$1</span>')
      .replace(/(\{|\}|\[|\]|\(|\)|;|,|\.)/g, '<span class="token punctuation">$1</span>')
      .replace(/(=>|\+|\-|\*|\/|=|==|===|\!|\!=|\!==|&amp;&amp;|\|\|)/g, '<span class="token operator">$1</span>');
    
    return `<div class="line-number">${highlighted}</div>`;
  };

  useEffect(() => {
    if (editorRef.current && file) {
      editorRef.current.innerHTML = highlightSyntax(file.content);
      
      // Append blinking cursor to the end
      const cursor = document.createElement('span');
      cursor.className = 'cursor';
      editorRef.current.appendChild(cursor);
    }
  }, [file]);

  if (!file) {
    return (
      <div className="flex-1 h-full flex items-center justify-center bg-background text-muted-foreground">
        <p className="text-lg">No file selected</p>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full bg-background overflow-auto">
      <div className="p-4 font-mono text-sm line-numbers">
        <div ref={editorRef} className="outline-none" />
      </div>
    </div>
  );
};

export default Editor;
