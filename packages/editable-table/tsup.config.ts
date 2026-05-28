import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/components/EditableTable/index.tsx'],
    format: ['esm'],
    dts: {
        compilerOptions: {
            ignoreDeprecations: '6.0',
        },
    },
    clean: true,
    external: ['react', 'react-dom', '@tanstack/react-virtual'],
});
