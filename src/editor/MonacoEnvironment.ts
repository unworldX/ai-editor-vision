/**
 * Sets up the Monaco environment for web workers
 * This is needed for Monaco editor to work properly in the browser
 */
export const setupMonacoEnvironment = (): void => {
  if (typeof window !== "undefined") {
    (window as any).MonacoEnvironment = {
      getWorker: (_: string, label: string) => {
        const workerMap: { [key: string]: string } = {
          json: "monaco-editor/esm/vs/language/json/json.worker?worker",
          css: "monaco-editor/esm/vs/language/css/css.worker?worker",
          html: "monaco-editor/esm/vs/language/html/html.worker?worker",
          typescript: "monaco-editor/esm/vs/language/typescript/ts.worker?worker",
          javascript: "monaco-editor/esm/vs/language/typescript/ts.worker?worker",
        };
        return new Worker(workerMap[label] || "monaco-editor/esm/vs/editor/editor.worker?worker", { type: "module" });
      },
    };
  }
};

// Call the setup function immediately
setupMonacoEnvironment(); 