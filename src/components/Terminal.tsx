import React, { useEffect, useRef, useState } from "react";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { X, Maximize2, Plus } from "lucide-react";
import "xterm/css/xterm.css";

export const Terminal: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const termInstance = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const commandHistory = useRef<string[]>([]);
  const historyIndex = useRef<number>(-1);
  const currentLineRef = useRef<string>("");

  const [isMaximized, setIsMaximized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!terminalRef.current || termInstance.current) return;

    // Initialize terminal
    const term = new XTerm({
      theme: {
        background: "#1e1e1e",
        foreground: "#cccccc",
        cursor: "#cccccc",
      },
      fontFamily: "Menlo, Monaco, 'Courier New', monospace",
      fontSize: 12,
      cursorBlink: true,
      scrollback: 1000,
    });
    const handleCommand = (command: string, term: XTerm) => {
      switch (command.toLowerCase()) {
        case "help":
          term.writeln("\r\nAvailable commands:");
          term.writeln("  help     - Show this help message");
          term.writeln("  clear    - Clear the terminal");
          term.writeln("  version  - Show terminal version");
          term.writeln("  exit     - Close the terminal");
          term.writeln("");
          break;
        case "clear":
          term.clear();
          break;
        case "version":
          term.writeln("\r\nTerminal v1.1.0");
          term.writeln("");
          break;
        case "exit":
          term.writeln("\r\nClosing terminal...");
          break;
        default:
          term.writeln(`\r\nCommand not found: ${command}`);
          term.writeln('Type "help" for available commands');
          term.writeln("");
      }
      term.write("\x1B[1;34m$ \x1B[0m"); // Show prompt again
    };

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    termInstance.current = term;
    fitAddonRef.current = fitAddon;

    term.write("\x1B[1;34m$ \x1B[0mWelcome to VS Code Terminal\r\n");
    term.write("\x1B[90mType 'help' for available commands\x1B[0m\r\n\r\n");
    term.write("\x1B[1;34m$ \x1B[0m");

    // Command Handling
    term.onData((data) => {
      const ord = data.charCodeAt(0);
      let currentLine = currentLineRef.current;

      if (ord === 13) {
        // Enter key
        term.write("\r\n");
        if (currentLine.trim()) {
          commandHistory.current.unshift(currentLine.trim());
          historyIndex.current = -1;
          handleCommand(currentLine.trim(), term);
        } else {
          term.write("\x1B[1;34m$ \x1B[0m");
        }
        currentLineRef.current = "";
      } else if (ord === 127) {
        // Backspace
        if (currentLine.length > 0) {
          currentLineRef.current = currentLine.slice(0, -1);
          term.write("\b \b");
        }
      } else {
        // Regular character input
        currentLineRef.current += data;
        term.write(data);
      }
    });

    term.onKey(({ domEvent }) => {
      const ev = domEvent;
      if (ev.key === "ArrowUp") {
        if (historyIndex.current < commandHistory.current.length - 1) {
          historyIndex.current++;
          const command = commandHistory.current[historyIndex.current];
          term.write("\x1b[2K\r"); // Clear current line
          term.write("\x1B[1;34m$ \x1B[0m" + command);
          currentLineRef.current = command;
        }
      } else if (ev.key === "ArrowDown") {
        term.write("\x1b[2K\r"); // Clear current line
        if (historyIndex.current > 0) {
          historyIndex.current--;
          const command = commandHistory.current[historyIndex.current];
          term.write("\x1B[1;34m$ \x1B[0m" + command);
          currentLineRef.current = command;
        } else {
          historyIndex.current = -1;
          term.write("\x1B[1;34m$ \x1B[0m");
          currentLineRef.current = "";
        }
      }
    });

    // Handle resizing
    const handleResize = () => fitAddon.fit();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      term.dispose();
      termInstance.current = null;
    };
  }, []);

  /** ✅ Fix: Ensure terminal resizes correctly on maximize */
  useEffect(() => {
    setTimeout(() => {
      fitAddonRef.current?.fit();
    }, 10);
  }, [isMaximized]);

  if (!isVisible) return null;

  return (
    <div
      className={`bg-[#1e1e1e] border-t border-[#2d2d2d] transition-all duration-200 ${
        isMaximized ? "flex-1 h-full" : "h-48"
      } flex flex-col`}
    >
      {/* ✅ Fix: Ensure terminal expands with flex-grow */}
      <div className="h-6 bg-[#2d2d2d] px-3 flex items-center justify-between text-xs text-[#cccccc]">
        <div className="flex items-center gap-2">
          <span>Terminal</span>
          <button className="hover:bg-[#3d3d3d] p-1 rounded transition-colors">
            <Plus className="w-3 h-3" />
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button
            className="hover:bg-[#3d3d3d] p-1 rounded transition-colors"
            onClick={() => setIsMaximized(!isMaximized)}
          >
            <Maximize2 className="w-3 h-3" />
          </button>
          <button
            className="hover:bg-[#3d3d3d] p-1 rounded transition-colors"
            onClick={() => setIsVisible(false)}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* ✅ Fix: Make terminal grow properly */}
      <div ref={terminalRef} className="flex-1 w-full overflow-hidden" />
    </div>
  );
};
