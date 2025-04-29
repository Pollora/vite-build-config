import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { wpPackages } from '../constants.js';

export default function wordpressGlobalsPlugin() {
	// Track dependencies for each block
	const blockDependencies = new Map();

	// Helper to get block info from file path
	const getBlockInfo = (id) => {
		const blockMatch = id.match(/src\/blocks\/([^/]+)\/([^/]+)\.js$/);
		if (blockMatch) {
			const [, blockName, fileName] = blockMatch;
			const entryType = fileName === 'index' || fileName === 'view' ? fileName : 'index';
			return { blockName, entryType };
		}
		return null;
	};

	// Helper to collect dependencies from code
	const collectDependencies = (code) => {
		const dependencies = new Set();
		let needsReact = false;

		Object.entries(wpPackages).forEach(([pkg, { dep, needsReact: pkgNeedsReact }]) => {
			const importRegex = new RegExp(`import\\s*{[^}]*}\\s*from\\s*['"]${pkg}['"]`, 'g');
			if (code.match(importRegex)) {
				dependencies.add(dep);
				if (pkgNeedsReact) {
					needsReact = true;
				}
			}
		});

		if (needsReact) {
			dependencies.add('react-jsx-runtime');
		}

		return dependencies;
	};

	return {
		name: 'wordpress-globals',
		transform(code, id) {
			if (!id.includes('node_modules')) {
				let transformedCode = code;
				const blockInfo = getBlockInfo(id);

				// Remove CSS imports
				transformedCode = transformedCode.replace(/import\s+['"]\.\/.*\.(?:css|scss)['"];?\n?/g, '');

				if (blockInfo) {
					const { blockName, entryType } = blockInfo;
					const key = `${blockName}/${entryType}`;
					const dependencies = collectDependencies(code);

					// Store or merge dependencies
					if (!blockDependencies.has(key)) {
						blockDependencies.set(key, new Set());
					}
					dependencies.forEach(dep =>
						blockDependencies.get(key).add(dep)
					);

					// Transform imports to globals
					Object.entries(wpPackages).forEach(([pkg, { global }]) => {
						const importRegex = new RegExp(`import\\s*{([^}]+)}\\s*from\\s*['"]${pkg}['"]`, 'g');
						transformedCode = transformedCode.replace(importRegex, (match, imports) => {
							const declarations = imports.split(',').map(imp => {
								const [name, alias] = imp.trim().split(/\s+as\s+/);
								const finalName = alias || name;
								return `const ${finalName.trim()} = ${global}.${name.trim()};`;
							});
							return declarations.join('\n');
						});
					});
				}

				return {
					code: transformedCode,
					map: null
				};
			}
		},
		renderChunk(code, chunk) {
			// Only process entry chunks
			if (chunk.isEntry) {
				return {
					code: `(function() {\n    'use strict';\n    ${code}\n})();`,
					map: null
				};
			}
			return null;
		},
		writeBundle(options, bundle) {
			// Generate asset files for each entry point
			Object.entries(bundle).forEach(([fileName, chunk]) => {
				if (chunk.type === 'chunk' && chunk.isEntry) {
					const filePath = path.join(options.dir, fileName);
					const fileContent = fs.readFileSync(filePath, 'utf-8');

					// Generate content hash
					const hash = crypto.createHash('md5')
						.update(fileContent)
						.digest('hex')
						.slice(0, 20);

					// Get dependencies for this entry
					const blockMatch = fileName.match(/blocks\/([^/]+)\/(index|view)\.js$/);
					if (blockMatch) {
						const [, blockName, fileType] = blockMatch;
						const key = `${blockName}/${fileType}`;
						const deps = Array.from(blockDependencies.get(key) || new Set());

						// Create the asset file
						const assetFileName = fileName.replace(/\.js$/, '.asset.php');
						const assetFilePath = path.join(options.dir, assetFileName);
						const assetContent = `<?php\nreturn array(\n    'dependencies' => array(${deps.map(dep => `'${dep}'`).join(', ')}),\n    'version' => '${hash}'\n);`;

						fs.writeFileSync(assetFilePath, assetContent);
					}
				}
			});
		}
	};
} 