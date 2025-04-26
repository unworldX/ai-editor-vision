import { Extension, ExtensionManifest } from '../types/extension';

export class ExtensionLoader {
  private static instance: ExtensionLoader;
  private constructor() {}

  static getInstance(): ExtensionLoader {
    if (!ExtensionLoader.instance) {
      ExtensionLoader.instance = new ExtensionLoader();
    }
    return ExtensionLoader.instance;
  }

  async loadExtension(manifest: ExtensionManifest): Promise<Extension> {
    try {
      let extension: Extension = {
        ...manifest,
        enabled: false,
      };

      if (manifest.main) {
        // In a real implementation, this would dynamically load the extension's main file
        // and execute its setup code. For security, you'd need to implement proper
        // sandboxing and validation.
        console.log(`Loading extension main file: ${manifest.main}`);
      }

      return extension;
    } catch (error) {
      console.error(`Failed to load extension ${manifest.id}:`, error);
      throw error;
    }
  }

  async validateManifest(manifest: ExtensionManifest): Promise<boolean> {
    // Implement validation logic for extension manifests
    const requiredFields = ['id', 'name', 'description', 'version', 'author'];
    return requiredFields.every((field) => manifest[field as keyof ExtensionManifest]);
  }
}