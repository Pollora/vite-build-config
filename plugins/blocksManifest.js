import path from 'path';
import fs from 'fs';
import { BUILDFOLDER, BLOCKSFOLDER } from '../constants.js';

/**
 * Vite plugin to generate a PHP manifest file for all built WordPress blocks.
 *
 * This plugin scans the build output for each block's block.json, collects their data,
 * and writes a PHP file (blocks-manifest.php) that returns an array of all block definitions.
 * This allows PHP code to easily access block metadata after the build.
 */
export default function createBlocksManifestPlugin(blocksPaths) {
    return {
        name: 'create-blocks-manifest',
        apply: 'build',
        async closeBundle() {
            const manifest = {};
            const buildBlocksPath = path.join(BUILDFOLDER, BLOCKSFOLDER);

            // Wait briefly to ensure all blocks are built before creating manifest
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Collect block.json data for each block
            for (const blockName of blocksPaths) {
                const blockJsonPath = path.join(buildBlocksPath, blockName, 'block.json');

                if (fs.existsSync(blockJsonPath)) {
                    const blockJson = JSON.parse(fs.readFileSync(blockJsonPath, 'utf8'));
                    manifest[blockName] = blockJson;
                }
            }

            // Helper to convert JS object to PHP array notation
            const convertToPhpArray = (obj, depth = 0) => {
                const indent = '\t'.repeat(depth);
                const innerIndent = '\t'.repeat(depth + 1);

                if (Array.isArray(obj)) {
                    if (obj.length === 0) {
                        return '[]';
                    }
                    const items = obj.map(item => convertToPhpArray(item, depth + 1)).join(',\n');
                    return `[\n${innerIndent}${items}\n${indent}]`;
                } else if (typeof obj === 'object' && obj !== null) {
                    const entries = Object.entries(obj).map(([key, value]) => {
                        const phpValue = convertToPhpArray(value, depth + 1);
                        return `${innerIndent}'${key}' => ${phpValue}`;
                    }).join(',\n');
                    return `[\n${entries}\n${indent}]`;
                } else if (typeof obj === 'string') {
                    return `'${obj}'`;
                } else {
                    return obj;
                }
            };

            // Write the PHP manifest file
            const manifestContent = `<?php\n// This file is generated. Do not modify it manually.\nreturn ${convertToPhpArray(manifest)};\n`;

            const manifestPath = path.join(BUILDFOLDER, BLOCKSFOLDER, 'blocks-manifest.php');
            fs.writeFileSync(manifestPath, manifestContent);
        }
    };
} 