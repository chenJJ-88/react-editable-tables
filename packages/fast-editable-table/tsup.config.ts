import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm'],
    dts: true,
    clean: true,
    external: ['react', 'react-dom', 'antd', '@formily/core', '@formily/react', '@formily/reactive'],
});
