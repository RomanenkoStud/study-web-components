import { defineConfig } from 'vite';

//https://stackoverflow.com/questions/76259677/vite-dev-server-throws-error-when-resolving-external-path-from-importmap
function viteIgnoreStaticImport(importKeys) {
    return {
        name: "vite-plugin-ignore-static-import",
        enforce: "pre" as "pre" | "post",
        // 1. insert to optimizeDeps.exclude to prevent pre-transform
        config(config) {
            config.optimizeDeps = {
            ...(config.optimizeDeps ?? {}),
            exclude: [...(config.optimizeDeps?.exclude ?? []), ...importKeys],
            };
        },
        // 2. push a plugin to rewrite the 'vite:import-analysis' prefix
        configResolved(resolvedConfig) {
            const VALID_ID_PREFIX = `/@id/`;
            const reg = new RegExp(
            `${VALID_ID_PREFIX}(${importKeys.join("|")})`,
            "g"
            );
            resolvedConfig.plugins.push({
            name: "vite-plugin-ignore-static-import-replace-idprefix",
            transform: (code) =>
                reg.test(code) ? code.replace(reg, (m, s1) => s1) : code,
            });
        },
        // 3. rewrite the id before 'vite:resolve' plugin transform to 'node_modules/...'
        resolveId: (id) => {
            if (importKeys.includes(id)) {
            return { id, external: true };
            }
        },
    };
}

export default defineConfig({
    base: '',
    build: {
        outDir: 'dist',
    },
    plugins: [
        viteIgnoreStaticImport(["simple-timestamp", "numeric-input", "autocomplete-combobox"]),
    ],
});
