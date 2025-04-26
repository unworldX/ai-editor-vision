import { create } from 'zustand';

interface FileContent {
  path: string;
  content: string;
}

interface FileTreeItem {
  name: string;
  isFolder?: boolean;
  children?: FileTreeItem[];
}

interface FileState {
  files: FileTreeItem[];
  currentFile: string | null;
  fileContents: Record<string, string>;
  setFiles: (files: FileTreeItem[]) => void;
  openFile: (path: string) => void;
  closeFile: (path: string) => void;
  updateFileContent: (path: string, content: string) => void;
  getFileContent: (path: string) => string;
  addFile: (name: string, parentPath?: string) => void;
  addFolder: (name: string, parentPath?: string) => void;
  moveItem: (sourcePath: string, targetPath: string) => void;
}

const defaultFileContents: Record<string, string> = {
  'src/App.tsx': `import React from 'react';\n// App component code...`,
  'src/main.tsx': `import React from 'react';\n// Main entry point...`,
  'package.json': `{\n  "name": "vscode-clone",\n  "version": "1.0.0"\n}`,
  'tsconfig.json': `{\n  "compilerOptions": {\n    "target": "ES2020"\n  }\n}`,
};

export const useFileStore = create<FileState>((set, get) => ({
  files: [], // Start with empty file system
  currentFile: null,
  fileContents: {},
  
  setFiles: (files) => set({ files }),
  
  openFile: (path) => set({ currentFile: path }),
  
  closeFile: (path) => set((state) => {
    if (state.currentFile === path) {
      return { currentFile: null };
    }
    return state;
  }),
  
  updateFileContent: (path, content) => 
    set((state) => ({
      fileContents: { ...state.fileContents, [path]: content }
    })),
    
  getFileContent: (path) => {
    const state = get();
    return state.fileContents[path] || '';
  },
  
  addFile: (name, parentPath) => set((state) => {
    const newFiles = [...state.files];
    const newFile = { name, isFolder: false };

    if (!parentPath) {
      newFiles.push(newFile);
    } else {
      const addToFolder = (items: FileTreeItem[], path: string[]): boolean => {
        const [first, ...rest] = path;
        const folder = items.find(item => item.name === first && item.isFolder);
        
        if (!folder) return false;
        
        if (rest.length === 0) {
          folder.children = folder.children || [];
          folder.children.push(newFile);
          return true;
        }
        
        return folder.children ? addToFolder(folder.children, rest) : false;
      };

      addToFolder(newFiles, parentPath.split('/'));
    }

    // Initialize file content
    const filePath = parentPath ? `${parentPath}/${name}` : name;
    const newFileContents = { ...state.fileContents, [filePath]: '' };

    return { files: newFiles, fileContents: newFileContents };
  }),
  
  addFolder: (name, parentPath) => set((state) => {
    const newFiles = [...state.files];
    const newFolder = { name, isFolder: true, children: [] };

    if (!parentPath) {
      newFiles.push(newFolder);
      return { files: newFiles };
    }

    const addToFolder = (items: FileTreeItem[], path: string[]): boolean => {
      const [first, ...rest] = path;
      const folder = items.find(item => item.name === first && item.isFolder);
      
      if (!folder) return false;
      
      if (rest.length === 0) {
        folder.children = folder.children || [];
        folder.children.push(newFolder);
        return true;
      }
      
      return folder.children ? addToFolder(folder.children, rest) : false;
    };

    addToFolder(newFiles, parentPath.split('/'));
    return { files: newFiles };
  }),

  moveItem: (sourcePath, targetPath) => set((state) => {
    const newFiles = [...state.files];
    
    // Helper function to find and remove item
    const findAndRemoveItem = (items: FileTreeItem[], path: string[]): FileTreeItem | null => {
      const [first, ...rest] = path;
      const index = items.findIndex(item => item.name === first);
      
      if (index === -1) return null;
      
      if (rest.length === 0) {
        const [item] = items.splice(index, 1);
        return item;
      }
      
      const folder = items[index];
      if (folder.children) {
        return findAndRemoveItem(folder.children, rest);
      }
      return null;
    };
    
    // Helper function to insert item
    const insertItem = (items: FileTreeItem[], path: string[], item: FileTreeItem): boolean => {
      const [first, ...rest] = path;
      const index = items.findIndex(i => i.name === first);
      
      if (rest.length === 0) {
        if (index === -1) {
          items.push(item);
        } else {
          items.splice(index, 0, item);
        }
        return true;
      }
      
      if (index === -1) return false;
      
      const folder = items[index];
      if (folder.isFolder && folder.children) {
        return insertItem(folder.children, rest, item);
      }
      return false;
    };

    const sourceParts = sourcePath.split('/');
    const targetParts = targetPath.split('/');
    
    const item = findAndRemoveItem(newFiles, sourceParts);
    if (item) {
      insertItem(newFiles, targetParts, item);
    }

    return { files: newFiles };
  }),
}));