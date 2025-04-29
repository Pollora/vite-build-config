/**
 * Vite plugin to clean up CSS file names ending with '2.css' in the build output.
 *
 * Some build processes may generate duplicate or suffixed CSS files (e.g., 'index2.css').
 * This plugin renames any '2.css' files to '.css' to ensure consistent asset naming.
 */
export default function cleanCssSuffixPlugin() {
    return {
      name: 'clean-css-suffix',
      generateBundle(options, bundle) {
        for (const [fileName, asset] of Object.entries(bundle)) {
          if (
            asset.type === 'asset' &&
            typeof fileName === 'string' &&
            fileName.endsWith('2.css')
          ) {
            const cleanedName = fileName.replace(/2\.css$/, '.css');
            // Rename in the bundle
            bundle[cleanedName] = { ...asset, fileName: cleanedName };
            delete bundle[fileName];
          }
        }
      }
    };
} 