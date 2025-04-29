import path from 'path';

export const SOURCEFOLDER = 'src';
export const BLOCKSFOLDER = 'blocks';
export const BUILDFOLDER = 'build';

export const defaultBlocksPath = path.resolve(process.cwd(), SOURCEFOLDER, BLOCKSFOLDER);

export const wpPackages = {
    '@wordpress/blocks': { global: 'wp.blocks', dep: 'wp-blocks', needsReact: true },
    '@wordpress/i18n': { global: 'wp.i18n', dep: 'wp-i18n', needsReact: false },
    '@wordpress/element': { global: 'wp.element', dep: 'wp-element', needsReact: true },
    '@wordpress/block-editor': { global: 'wp.blockEditor', dep: 'wp-block-editor', needsReact: true },
    '@wordpress/components': { global: 'wp.components', dep: 'wp-components', needsReact: true },
    '@wordpress/data': { global: 'wp.data', dep: 'wp-data', needsReact: false },
    '@wordpress/compose': { global: 'wp.compose', dep: 'wp-compose', needsReact: false },
    '@wordpress/hooks': { global: 'wp.hooks', dep: 'wp-hooks', needsReact: false },
    '@wordpress/api-fetch': { global: 'wp.apiFetch', dep: 'wp-api-fetch', needsReact: false },
};

export default {
  SOURCEFOLDER,
  BLOCKSFOLDER,
  BUILDFOLDER,
  defaultBlocksPath,
  wpPackages
}; 