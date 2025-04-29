import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { defaultBlocksPath } from './constants.js';

export function getBlockDirectories(blocksPath) {
    if (!fs.existsSync(blocksPath)) {
        fs.mkdirSync(blocksPath, { recursive: true });
        return [];
    }
    return fs.readdirSync(blocksPath)
        .filter(file => fs.statSync(path.join(blocksPath, file)).isDirectory());
}

export async function getBlockFiles(blockPath, patterns) {
    return glob(patterns, { cwd: blockPath, absolute: true });
}

export function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

export function copyFilesToBuild(files, blockName, sourceDir, buildDir) {
    files.forEach(file => {
        const relativePath = path.relative(sourceDir, file);
        const targetPath = path.join(buildDir, relativePath);
        ensureDir(path.dirname(targetPath));
        fs.copyFileSync(file, targetPath);
    });
}

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