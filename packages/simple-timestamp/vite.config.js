import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
    plugins: [
        dts({ 
            include: ['src'], 
            insertTypesEntry: true, 
        })
    ],
    build: {
        lib: {
            entry: {
                "simple-timestamp": resolve(__dirname, 'src/index.ts'), 
                "utils": resolve(__dirname, 'src/utils/index.ts'),
            },
            name: "@romanenko.pavlo/simple-timestamp",
            formats: ['es', 'cjs'],
        },
    }
});