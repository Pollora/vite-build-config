import path from 'path';
import { BUILDFOLDER, BLOCKSFOLDER, defaultBlocksPath } from '../constants.js';
import { ensureDir, getBlockFiles, copyFilesToBuild } from '../utils.js';

/**
 * Vite plugin to copy PHP and JSON files for each block into the build output.
 *
 * After the Vite build completes, this plugin finds all PHP and JSON files in each block's source directory
 * and copies them to the corresponding build directory. This ensures that server-side files are available
 * alongside the built JS/CSS assets for each block.
 */
export default function createCopyBlockFilesPlugin(blocksPaths) {
    return {
        name: 'copy-block-files',
        apply: 'build',
        async closeBundle() {
            // Copy files after the build is complete
            for (const blockName of blocksPaths) {
                const blockSourcePath = path.join(defaultBlocksPath, blockName);
                const blockBuildPath = path.join(BUILDFOLDER, BLOCKSFOLDER, blockName);

                // Ensure the block build directory exists
                ensureDir(blockBuildPath);

                // Find and copy PHP and JSON files
                const filesToCopy = await getBlockFiles(blockSourcePath, ['**/*.{php,json}']);
                copyFilesToBuild(filesToCopy, blockName, blockSourcePath, blockBuildPath);
            }
        }
    };
} 