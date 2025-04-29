/**
 * Vite plugin wrapper for @vitejs/plugin-react.
 *
 * This function returns the configured React plugin for Vite, enabling React fast refresh and JSX/TSX support.
 * Exported as a function for consistency with other custom plugins in this package.
 */
import react from '@vitejs/plugin-react';

export default function reactPlugin() {
    return react({
        babel: {
            presets: ['@babel/preset-react']
        }
    });
} 