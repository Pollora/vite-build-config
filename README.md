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

//Replace config values here,
// @see : https://github.com/Pollora/documentation
const config = {
    ...defaultConfig,
};

export default defineConfig(config);
```

## License

MIT (or your chosen license) 
