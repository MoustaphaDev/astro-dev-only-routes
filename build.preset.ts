import { definePreset } from 'unbuild';

export default definePreset({
    clean: true,
    declaration: true,
    rollup: {
        inlineDependencies: true,
        esbuild: {
            minify: true,
            sourceMap: true,
        },
    },
});
