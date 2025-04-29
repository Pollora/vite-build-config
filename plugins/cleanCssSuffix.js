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