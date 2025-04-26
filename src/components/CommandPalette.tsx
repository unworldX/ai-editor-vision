import React from 'react';
import { Command } from 'cmdk';
import { useEditorStore } from '../store/editorStore';
import { Search } from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const { commands, editor } = useEditorStore();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'p' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[640px] max-w-[90vw] max-h-[85vh] overflow-hidden rounded-xl bg-gray-800 border border-gray-700 shadow-2xl"
      label="Command Menu"
    >
      <div className="flex items-center border-b border-gray-700 px-3">
        <Search className="w-4 h-4 text-gray-400" />
        <Command.Input
          className="flex-1 h-12 bg-transparent border-0 outline-none text-white placeholder:text-gray-400 px-2"
          placeholder="Type a command or search..."
        />
      </div>

      <Command.List className="max-h-[300px] overflow-auto p-2">
        <Command.Empty className="text-sm text-gray-400 p-2 text-center">
          No results found.
        </Command.Empty>

        {commands.map((command) => (
          <Command.Item
            key={command.id}
            onSelect={() => {
              if (editor) {
                command.execute(editor);
              }
              setOpen(false);
            }}
            className="text-sm text-gray-200 rounded-lg p-2 cursor-pointer hover:bg-gray-700 flex items-center justify-between"
          >
            <span>{command.name}</span>
            {command.keybinding && (
              <kbd className="text-xs bg-gray-700 px-2 py-1 rounded">
                {command.keybinding}
              </kbd>
            )}
          </Command.Item>
        ))}
      </Command.List>
    </Command.Dialog>
  );
};