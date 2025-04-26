import React, { useState } from "react";
import { X, Minus, Maximize2, Maximize, Menu } from "lucide-react";

interface MenuItem {
  label: string;
  submenu?: { label: string; shortcut?: string }[];
}

const menuItems: MenuItem[] = [
  {
    label: "File",
    submenu: [
      { label: "New File", shortcut: "Ctrl+N" },
      { label: "New Window", shortcut: "Ctrl+Shift+N" },
      { label: "Open Folder...", shortcut: "Ctrl+K Ctrl+O" },
      { label: "Save", shortcut: "Ctrl+S" },
      { label: "Save As...", shortcut: "Ctrl+Shift+S" },
      { label: "Auto Save" },
      { label: "Preferences" },
      { label: "Close Folder" },
      { label: "Exit", shortcut: "Alt+F4" },
    ],
  },
  {
    label: "Edit",
    submenu: [
      { label: "Undo", shortcut: "Ctrl+Z" },
      { label: "Redo", shortcut: "Ctrl+Y" },
      { label: "Cut", shortcut: "Ctrl+X" },
      { label: "Copy", shortcut: "Ctrl+C" },
      { label: "Paste", shortcut: "Ctrl+V" },
      { label: "Find", shortcut: "Ctrl+F" },
      { label: "Replace", shortcut: "Ctrl+H" },
    ],
  },
  {
    label: "Selection",
    submenu: [
      { label: "Select All", shortcut: "Ctrl+A" },
      { label: "Expand Selection", shortcut: "Alt+Shift+→" },
      { label: "Shrink Selection", shortcut: "Alt+Shift+←" },
      { label: "Select Line" },
      { label: "Column Selection", shortcut: "Alt+Shift+Insert" },
    ],
  },
  {
    label: "View",
    submenu: [
      { label: "Explorer", shortcut: "Ctrl+Shift+E" },
      { label: "Search", shortcut: "Ctrl+Shift+F" },
      { label: "Source Control", shortcut: "Ctrl+Shift+G" },
      { label: "Extensions", shortcut: "Ctrl+Shift+X" },
      { label: "Command Palette", shortcut: "Ctrl+Shift+P" },
      { label: "Appearance" },
      { label: "Zoom In", shortcut: "Ctrl++" },
      { label: "Zoom Out", shortcut: "Ctrl+-" },
    ],
  },
  {
    label: "Go",
    submenu: [
      { label: "Back", shortcut: "Alt+←" },
      { label: "Forward", shortcut: "Alt+→" },
      { label: "Go to File", shortcut: "Ctrl+P" },
      { label: "Go to Definition", shortcut: "F12" },
      { label: "Go to Line/Column", shortcut: "Ctrl+G" },
    ],
  },
  {
    label: "Run",
    submenu: [
      { label: "Start Debugging", shortcut: "F5" },
      { label: "Run Without Debugging", shortcut: "Ctrl+F5" },
      { label: "Stop Debugging", shortcut: "Shift+F5" },
      { label: "Restart Debugging", shortcut: "Ctrl+Shift+F5" },
      { label: "Configure Run Settings" },
    ],
  },
  {
    label: "Terminal",
    submenu: [
      { label: "New Terminal", shortcut: "Ctrl+" },
      { label: "Split Terminal", shortcut: "Ctrl+Shift+5" },
      { label: "Run Active File", shortcut: "Ctrl+F5" },
      { label: "Kill Terminal", shortcut: "Ctrl+Shift+W" },
    ],
  },
  {
    label: "Help",
    submenu: [
      { label: "Welcome" },
      { label: "Documentation" },
      { label: "About", shortcut: "F1" },
      { label: "Check for Updates" },
      { label: "Keyboard Shortcuts Reference" },
      { label: "Report Issues" },
    ],
  },
];

export const TitleBar: React.FC = () => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  let submenuTimeout: ReturnType<typeof setTimeout>;

  const handleWindowControl = (action: "minimize" | "maximize" | "close") => {
    if (action === "maximize") setIsMaximized(!isMaximized);
  };

  return (
    <div className="relative flex items-center bg-[#3c3c3c] text-[#cccccc] text-xs h-8 select-none px-2">
      {/* ✅ Left Side Menu Toggle */}
      <button
        className="p-1 hover:bg-[#505050] rounded transition"
        onClick={() => {
          setMenuOpen(!menuOpen);
          setActiveSubMenu(null);
        }}
        aria-label="Toggle Menu"
      >
        {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      {/* ✅ Menu Bar (Only Show When Menu is Open) */}
      {menuOpen && (
        <div className="flex gap-0 px-3">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="relative"
              onMouseEnter={() => {
                clearTimeout(submenuTimeout); // Prevent hiding if re-entered
                setActiveSubMenu(item.label);
              }}
              onMouseLeave={() => {
                submenuTimeout = setTimeout(() => setActiveSubMenu(null), 2000); // 2-sec delay before hiding
              }}
            >
              <div className="hover:bg-[#505050] px-2 py-1 cursor-pointer rounded text-sm">
                {item.label}
              </div>

              {/* ✅ Submenu on Hover */}
              {activeSubMenu === item.label && item.submenu && (
                <div
                  className="absolute top-full left-0 bg-[#3c3c3c] border border-[#505050] shadow-lg min-w-[220px] z-50 rounded-md mt-1 transition-all duration-150"
                  onMouseEnter={() => setActiveSubMenu(item.label)} // Keeps submenu open while inside
                  onMouseLeave={() => setActiveSubMenu(null)} // 🔥 Instantly hides when cursor leaves
                >
                  {item.submenu.map((subItem, subIndex) => (
                    <div
                      key={subIndex}
                      className="px-4 py-2 hover:bg-[#505050] flex justify-between whitespace-nowrap"
                    >
                      <span>{subItem.label}</span>
                      {subItem.shortcut && (
                        <span className="text-[#8c8c8c] text-xs">
                          {subItem.shortcut}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ✅ Centered Logo & Name */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-1">
        <img
          src="/src/assets/image/logo.png"
          alt="AURA Logo"
          className="w-4 h-4"
        />
        <span className="text-[12px] font-medium">AURA Editor</span>
      </div>

      {/* ✅ Right Side Window Controls */}
      <div className="ml-auto flex space-x-0 h-full">
        <button
          className="hover:bg-[#505050] px-3 h-full"
          onClick={() => handleWindowControl("minimize")}
          aria-label="Minimize"
        >
          <Minus className="w-3 h-3" />
        </button>
        <button
          className="hover:bg-[#505050] px-3 h-full"
          onClick={() => handleWindowControl("maximize")}
          aria-label={isMaximized ? "Restore" : "Maximize"}
        >
          {isMaximized ? (
            <Maximize className="w-3 h-3" />
          ) : (
            <Maximize2 className="w-3 h-3" />
          )}
        </button>
        <button
          className="hover:bg-[#e81123] px-3 h-full"
          onClick={() => handleWindowControl("close")}
          aria-label="Close"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
