
/**
 * Maps file extensions to Monaco editor language identifiers
 */
export const getLanguageFromFilename = (filename: string): string => {
  if (!filename) return 'plaintext';
  
  const extensionMap: Record<string, string> = {
    // JavaScript and TypeScript
    js: 'javascript', jsx: 'javascript',
    ts: 'typescript', tsx: 'typescript',
    
    // Web technologies
    json: 'json', html: 'html', css: 'css',
    scss: 'scss', less: 'less', xml: 'xml',
    
    // Server languages
    php: 'php', py: 'python', rb: 'ruby',
    java: 'java', c: 'c', cpp: 'cpp', cs: 'csharp',
    go: 'go', rs: 'rust', swift: 'swift',
    
    // Configuration and other
    sh: 'shell', sql: 'sql', yaml: 'yaml', yml: 'yaml',
    toml: 'toml', markdown: 'markdown', md: 'markdown',
    dockerfile: 'dockerfile', makefile: 'makefile',
    ini: 'ini', bat: 'bat', ps1: 'powershell',
    
    // Special handling for common extensions
    gitignore: 'plaintext',
    npmrc: 'plaintext',
    env: 'plaintext'
  };
  
  // Get file extension or name for special files
  const parts = filename.split('/');
  const lastPart = parts[parts.length - 1];
  const extension = lastPart.includes('.')
    ? lastPart.split('.').pop()?.toLowerCase() || ''
    : lastPart.toLowerCase();
  
  return extensionMap[extension] || 'plaintext';
};
