import react from '@vitejs/plugin-react';

export default function reactPlugin() {
    return react({
        babel: {
            presets: ['@babel/preset-react']
        }
    });
} 