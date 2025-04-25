
import React from 'react';
import { 
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from './ui/menubar';
import { FileItem } from '../utils/mockData';
import { 
  FilePlus,
  Trash2,
  Copy,
  ClipboardCopy,
  Terminal,
  LayoutDashboard,
  Pencil,
} from 'lucide-react';

interface MenuBarProps {
  onNewFile: () => void;
  onDelete: () => void;
  onRename: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onToggleTerminal: () => void;
  onToggleLayout: () => void;
  activeFile: FileItem | null;
}

const MenuBar: React.FC<MenuBarProps> = ({
  onNewFile,
  onDelete,
  onRename,
  onCopy,
  onPaste,
  onToggleTerminal,
  onToggleLayout,
  activeFile
}) => {
  return (
    <div className="border-b border-border">
      <Menubar className="rounded-none border-none">
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={onNewFile}>
              <FilePlus className="w-4 h-4 mr-2" />
              New File
              <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={onRename} disabled={!activeFile}>
              <Pencil className="w-4 h-4 mr-2" />
              Rename
              <MenubarShortcut>F2</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={onDelete} disabled={!activeFile}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
              <MenubarShortcut>⌘⌫</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={onCopy} disabled={!activeFile}>
              <Copy className="w-4 h-4 mr-2" />
              Copy
              <MenubarShortcut>⌘C</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={onPaste}>
              <ClipboardCopy className="w-4 h-4 mr-2" />
              Paste
              <MenubarShortcut>⌘V</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={onToggleTerminal}>
              <Terminal className="w-4 h-4 mr-2" />
              Toggle Terminal
              <MenubarShortcut>⌘J</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={onToggleLayout}>
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Toggle Layout
              <MenubarShortcut>⌘\\</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
};

export default MenuBar;
