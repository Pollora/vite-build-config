import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { defaultBlocksPath } from './constants.js';

/**
 * Returns a list of all subdirectories (blocks) in the given blocksPath.
 * Ensures the directory exists (creates it if missing).
 * Used to discover all block folders for build processing.
 */
export function getBlockDirectories(blocksPath) {
    if (!fs.existsSync(blocksPath)) {
        fs.mkdirSync(blocksPath, { recursive: true });
        return [];
    }
    return fs.readdirSync(blocksPath)
        .filter(file => fs.statSync(path.join(blocksPath, file)).isDirectory());
}

/**
 * Finds all files matching the given glob patterns in a directory.
 * Used to locate PHP, JSON, or other files for copying or processing.
 * Returns absolute paths.
 */
export async function getBlockFiles(blockPath, patterns) {
    return glob(patterns, { cwd: blockPath, absolute: true });
}

/**
 * Ensures a directory exists, creating it recursively if needed.
 * Used before writing files to guarantee the target path is valid.
 */
export function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

/**
 * Copies a list of files from the sourceDir to the buildDir, preserving relative paths.
 * Used to move PHP/JSON files for each block into the build output.
 */
export function copyFilesToBuild(files, blockName, sourceDir, buildDir) {
    files.forEach(file => {
        const relativePath = path.relative(sourceDir, file);
        const targetPath = path.join(buildDir, relativePath);
        ensureDir(path.dirname(targetPath));
        fs.copyFileSync(file, targetPath);
    });
}

/**
 * Computes the Vite/Rollup input object for all block entry points.
 * Scans each block for index.js, view.js, style.scss, and editor.scss (or .css variants).
 * Returns an object mapping output paths to source files for use in Vite config.
 */
export function computeBlockInputs(blocksPaths) {
    const inputs = {};
    blocksPaths.forEach(blockName => {
        const blockSourcePath = path.join(defaultBlocksPath, blockName);
        const blockBuildPath = path.posix.join('blocks', blockName);
        const files = [
            { candidates: ['style.css', 'style.scss'], type: 'style-index.css' },
            { candidates: ['editor.css', 'editor.scss'], type: 'index.css' },
            { candidates: ['index.js'], type: 'index.js' },
            { candidates: ['view.js'], type: 'view.js' },
        ];
        files.forEach(({ candidates, type }) => {
            let found = false;
        
            candidates.forEach(candidate => {
               if (found) return; // si déjà trouvé, on ne regarde pas les autres
        
               const fullPath = path.join(blockSourcePath, candidate);
               if (fs.existsSync(fullPath)) {
                  const name = path.posix.join(blockBuildPath, type);
                  inputs[name] = fullPath;
                  found = true;
               }
            });
        });
    });
    return inputs;
}

export default {
  getBlockDirectories,
  getBlockFiles,
  ensureDir,
  copyFilesToBuild,
  computeBlockInputs
}; 