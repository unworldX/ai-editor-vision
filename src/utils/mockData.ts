
export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  icon?: string;
  extension?: string;
  content?: string;
  children?: FileItem[];
  expanded?: boolean;
}

export const mockFiles: FileItem[] = [
  {
    id: '1',
    name: 'src',
    type: 'folder',
    expanded: true,
    children: [
      {
        id: '2',
        name: 'components',
        type: 'folder',
        expanded: true,
        children: [
          {
            id: '3',
            name: 'App.tsx',
            type: 'file',
            extension: 'tsx',
            content: `import React from 'react';\nimport { useState } from 'react';\n\nconst App = () => {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div className="app">\n      <h1>Hello, VS Code AI!</h1>\n      <button onClick={() => setCount(count + 1)}>\n        Count: {count}\n      </button>\n    </div>\n  );\n};\n\nexport default App;`
          },
          {
            id: '4',
            name: 'Button.tsx',
            type: 'file',
            extension: 'tsx',
            content: `import React from 'react';\n\ninterface ButtonProps {\n  children: React.ReactNode;\n  onClick?: () => void;\n  variant?: 'primary' | 'secondary';\n}\n\nconst Button = ({ children, onClick, variant = 'primary' }: ButtonProps) => {\n  return (\n    <button \n      className={\\`btn btn-\\${variant}\\`}\n      onClick={onClick}\n    >\n      {children}\n    </button>\n  );\n};\n\nexport default Button;`
          }
        ]
      },
      {
        id: '5',
        name: 'utils',
        type: 'folder',
        children: [
          {
            id: '6',
            name: 'helpers.ts',
            type: 'file',
            extension: 'ts',
            content: `/**\n * Format date to readable string\n */\nexport function formatDate(date: Date): string {\n  return new Intl.DateTimeFormat('en-US', {\n    year: 'numeric',\n    month: 'long',\n    day: 'numeric'\n  }).format(date);\n}\n\n/**\n * Generate a unique ID\n */\nexport function generateId(): string {\n  return Math.random().toString(36).substring(2, 9);\n}`
          }
        ]
      },
      {
        id: '7',
        name: 'main.tsx',
        type: 'file',
        extension: 'tsx',
        content: `import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './components/App';\nimport './styles.css';\n\nReactDOM.createRoot(document.getElementById('root')!).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);`
      }
    ]
  },
  {
    id: '8',
    name: 'package.json',
    type: 'file',
    extension: 'json',
    content: `{\n  "name": "vscode-ai-editor",\n  "version": "0.1.0",\n  "private": true,\n  "dependencies": {\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0"\n  },\n  "scripts": {\n    "dev": "vite",\n    "build": "vite build",\n    "preview": "vite preview"\n  }\n}`
  },
  {
    id: '9',
    name: 'README.md',
    type: 'file',
    extension: 'md',
    content: `# VS Code AI Editor\n\nA modern editor interface with AI assistance.\n\n## Features\n\n- Code editing with syntax highlighting\n- File explorer\n- AI assistant\n- Multiple tabs\n\n## Getting Started\n\n\`\`\`\nnpm install\nnpm run dev\n\`\`\``
  }
];

export const mockAiMessages = [
  {
    id: '1',
    sender: 'ai',
    content: 'Hello! I\'m your AI coding assistant. How can I help you today?',
    timestamp: new Date(Date.now() - 50000)
  },
  {
    id: '2',
    sender: 'user',
    content: 'Can you help me write a simple React component?',
    timestamp: new Date(Date.now() - 40000)
  },
  {
    id: '3',
    sender: 'ai',
    content: 'Of course! Here\'s a basic React functional component:\n\n```jsx\nimport React from \'react\';\n\nconst MyComponent = ({ title }) => {\n  return (\n    <div>\n      <h1>{title}</h1>\n      <p>This is my component</p>\n    </div>\n  );\n};\n\nexport default MyComponent;\n```',
    timestamp: new Date(Date.now() - 30000)
  }
];

export interface OpenFile {
  id: string;
  name: string;
  content: string;
  extension: string;
  isActive?: boolean;
}
