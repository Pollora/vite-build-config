//Imports
import createCopyBlockFilesPlugin from './plugins/copyBlockFiles.js';
import createBlocksManifestPlugin from './plugins/blocksManifest.js';
import cleanCssSuffixPlugin from './plugins/cleanCssSuffix.js';
import wordpressGlobalsPlugin from './plugins/wordpressGlobals.js';
import reactPlugin from './plugins/react.js';
import { BUILDFOLDER, defaultBlocksPath, wpPackages } from './constants.js';
import { getBlockDirectories, computeBlockInputs } from './utils.js';

const blocksPaths = getBlockDirectories(defaultBlocksPath);

export const defaultConfig = {
    build: {
        outDir: BUILDFOLDER,
        emptyOutDir: true,
        rollupOptions: {
            input: computeBlockInputs(blocksPaths),
            output: {
                entryFileNames: '[name]',
                assetFileNames: '[name].[ext]'
            },
            external: Object.keys(wpPackages)
        }
    },
    plugins: [
        wordpressGlobalsPlugin(),
        reactPlugin(),
        createCopyBlockFilesPlugin(blocksPaths),
        createBlocksManifestPlugin(blocksPaths),
        cleanCssSuffixPlugin()
    ]
};
