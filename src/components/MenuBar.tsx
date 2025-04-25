
import React from 'react';
import { 
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarCheckboxItem,
} from './ui/menubar';
import { 
  FilePlus,
  FolderOpen,
  Save,
  ClipboardCopy,
  Terminal,
  LayoutDashboard,
  Pencil,
  Settings,
  FileSearch,
  FolderSearch,
  Undo2,
  Redo2,
  Scissors,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  Search,
  ChevronDown,
  Menu,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface FileInfo {
  id: string;
  name: string;
  extension: string;
  type: string;
}

interface MenuBarProps {
  onNewFile: () => void;
  onDelete: () => void;
  onRename: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onToggleTerminal: () => void;
  onToggleLayout: () => void;
  activeFile: FileInfo | null;
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
            <MenubarItem>
              <FolderOpen className="w-4 h-4 mr-2" />
              Open Folder
              <MenubarShortcut>⌘O</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem disabled={!activeFile}>
              <Save className="w-4 h-4 mr-2" />
              Save
              <MenubarShortcut>⌘S</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled={!activeFile}>
              <Save className="w-4 h-4 mr-2" />
              Save As...
              <MenubarShortcut>⇧⌘S</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarCheckboxItem>
              Auto Save
            </MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarSub>
              <MenubarSubTrigger>
                <Settings className="w-4 h-4 mr-2" />
                Preferences
              </MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>Settings</MenubarItem>
                <MenubarItem>Keyboard Shortcuts</MenubarItem>
                <MenubarItem>User Snippets</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <Undo2 className="w-4 h-4 mr-2" />
              Undo
              <MenubarShortcut>⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <Redo2 className="w-4 h-4 mr-2" />
              Redo
              <MenubarShortcut>⇧⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem disabled={!activeFile}>
              <Scissors className="w-4 h-4 mr-2" />
              Cut
              <MenubarShortcut>⌘X</MenubarShortcut>
            </MenubarItem>
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
            <MenubarSeparator />
            <MenubarItem>
              <Search className="w-4 h-4 mr-2" />
              Find
              <MenubarShortcut>⌘F</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <Search className="w-4 h-4 mr-2" />
              Replace
              <MenubarShortcut>⌘H</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={onToggleLayout}>
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Toggle Layout
              <MenubarShortcut>⌘\\</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarCheckboxItem>
              <Menu className="w-4 h-4 mr-2" />
              Show Menu Bar
            </MenubarCheckboxItem>
            <MenubarCheckboxItem>
              <Eye className="w-4 h-4 mr-2" />
              Show Side Bar
            </MenubarCheckboxItem>
            <MenubarCheckboxItem>
              <EyeOff className="w-4 h-4 mr-2" />
              Show Status Bar
            </MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarItem>
              <Maximize2 className="w-4 h-4 mr-2" />
              Full Screen
              <MenubarShortcut>F11</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <Minimize2 className="w-4 h-4 mr-2" />
              Zen Mode
              <MenubarShortcut>⌘K Z</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>Go</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <FileSearch className="w-4 h-4 mr-2" />
              Go to File...
              <MenubarShortcut>⌘P</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <FolderSearch className="w-4 h-4 mr-2" />
              Find in Files
              <MenubarShortcut>⇧⌘F</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>Terminal</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={onToggleTerminal}>
              <Terminal className="w-4 h-4 mr-2" />
              New Terminal
              <MenubarShortcut>⌘J</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled>
              <Terminal className="w-4 h-4 mr-2" />
              Split Terminal
              <MenubarShortcut>⌘\\</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
};

export default MenuBar;
