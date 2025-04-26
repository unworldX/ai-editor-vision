export const getLanguageFromFilename = (filename: string): string => {
  if (!filename) return 'plaintext';

  const extension = filename.split('.').pop()?.toLowerCase() || '';
  
  const extensionMap: Record<string, string> = {
    // JavaScript and TypeScript
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    
    // Web
    'html': 'html',
    'css': 'css',
    'scss': 'scss',
    'less': 'less',
    'json': 'json',
    
    // Other languages
    'py': 'python',
    'java': 'java',
    'c': 'c',
    'cpp': 'cpp',
    'cs': 'csharp',
    'go': 'go',
    'rs': 'rust',
    'php': 'php',
    'rb': 'ruby',
    'swift': 'swift',
    
    // Markup and config
    'md': 'markdown',
    'xml': 'xml',
    'yaml': 'yaml',
    'yml': 'yaml',
    'toml': 'ini',
    'ini': 'ini',
    'sql': 'sql',
    'graphql': 'graphql',
    'sh': 'shell',
    'bat': 'bat',
    'dockerfile': 'dockerfile',
  };
  
  return extensionMap[extension] || 'plaintext';
};
