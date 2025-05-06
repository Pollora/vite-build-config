# vite-build-config

A modular Vite build configuration for WordPress block development.

## Overview

This package provides a set of reusable Vite plugins, utilities, and configuration patterns tailored for building custom WordPress blocks using Vite. It helps automate asset management, manifest generation, and WordPress-specific build steps.

## Features
- Modular Vite plugins for WordPress block workflows
- Automatic copying of PHP/JSON files
- Asset manifest and dependency generation
- SCSS/CSS handling and cleanup
- React and WordPress globals support

## Installation

Clone or install this package into your project:

```sh
npm install @pollora/vite-build-config
```

or with Yarn:

```sh
yarn add @pollora/vite-build-config
```

> **Note:**
> This package does **not** include `@wordpress/*` dependencies (such as `@wordpress/block-editor`, `@wordpress/blocks`, etc.).
> You must install these in your own project if your blocks depend on them:
>
> ```sh
> npm install @wordpress/block-editor @wordpress/blocks ...
> ```

## Usage

In your vite config file, import and use the default pollora vite config object, then adjust as needed:

```js
import { defineConfig } from "vite";
import { defaultConfig } from "pollora-vite-build-config";

// For npm readme, @see : https://www.npmjs.com/package/@pollora/vite-build-config
// For available constants, @see : https://github.com/Pollora/vite-build-config/blob/main/constants.js
// For available utility functions, @see : https://github.com/Pollora/vite-build-config/blob/main/utils.js
// For available plugins, @see : https://github.com/Pollora/vite-build-config/tree/main/plugins

//Replace config values here,
const config = {
    ...defaultConfig,
};

export default defineConfig(config);
```

If you want to use tailwindcss instead of sass, you can do something like this:

```js
import { defineConfig } from "vite";
import tailwindcss from '@tailwindcss/vite';

import {
    defaultConfig,
} from "@pollora/vite-build-config";

// Merge with default config from the package
const config = {
    ...defaultConfig,
    ...{
        plugins: [
            tailwindcss(),
            ...defaultConfig.plugins
        ],
    }
};

export default defineConfig(config);
```

## License

MIT
