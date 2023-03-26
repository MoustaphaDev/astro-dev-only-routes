import type { AstroIntegration, AstroConfig } from 'astro';
import { fileURLToPath } from 'url';
import type { Plugin } from 'vite';
import fs from 'fs';

function getVitePlugin(config: AstroConfig): Plugin | void {
    console.log('hey');
    const devPreviewFolderPath = fileURLToPath(
        new URL('./src/pages/__DEV_PREVIEW__', config.root)
    );
    // let doesFolderExist;
    // try {
    // } catch (e) {
    //     return;
    // }
    return {
        name: 'vite-plugin-astro-dev-only-routes',
        enforce: 'pre',
        resolveId(id) {
            console.log({ id, devPreviewFolderPath });
            if (
                !fs.existsSync(devPreviewFolderPath) ||
                !id.startsWith(devPreviewFolderPath) ||
                !id.endsWith('.astro')
            ) {
                console.log('nope');
                return id;
            }
            return id.replace('__DEV_PREVIEW__', 'DEV_PREVIEW');
        },
    };
}

export default function integration(): AstroIntegration {
    return {
        name: 'astro-dev-only-routes',
        hooks: {
            'astro:config:setup': ({ injectRoute, updateConfig, config }) => {
                updateConfig({
                    vite: {
                        plugins: [getVitePlugin(config)],
                    },
                } as AstroConfig);
            },
        },
    };
}
