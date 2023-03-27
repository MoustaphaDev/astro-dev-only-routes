import type { AstroIntegration, AstroConfig } from 'astro';
import { fileURLToPath } from 'url';
import type { Plugin } from 'vite';
import { globbySync } from 'globby';
import npath from 'path';

const VIRTUAL_MODULE_ID = 'virtual:astro-dev-only-routes';
const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID;

type PluginOptions = {
    devOnlyRoutes?: string[];
};
function getVitePlugin(opts?: PluginOptions): Plugin | void {
    console.log('hey');
    if (!opts) return;
    if (!opts.devOnlyRoutes) return;
    const devOnlyRoutes = opts.devOnlyRoutes;
    return {
        name: 'vite-plugin-astro-dev-only-routes',
        resolveId(id) {
            const [requestId, query] = splitVirtualModuleRequest(id);

            if (requestId === VIRTUAL_MODULE_ID) {
                return RESOLVED_VIRTUAL_MODULE_ID + (query ? '?' + query : '');
            }
        },
        load(id) {
            const [, query] = splitVirtualModuleRequest(id);
            if (id !== RESOLVED_VIRTUAL_MODULE_ID + (query ? '?' + query : ''))
                return undefined;
            // BUG?: returning undefined/null causes an error!!
            if (!query) return '';

            if (devOnlyRoutes.includes(query + '.astro')) return '';

            return `import Component from "/src/pages/__${query}.astro"
export default Component`;
        },
    };
}
export default function integration(): AstroIntegration {
    return {
        name: 'astro-dev-only-routes',
        hooks: {
            'astro:config:setup': ({ injectRoute, updateConfig, config }) => {
                // Find a way to do this in the config:resolved hook, so that
                // even injected dev only routes are included in the list.
                // Right now some dev only routes may not be included in the list
                // if they are injected after this integration
                let pagesDir = new URL('./src/pages', config.root);

                // TODO: support .mdx, .md, .ts, .js
                let devOnlyRouteNames = globbySync('**/__*.astro', {
                    cwd: pagesDir,
                }).map((route) => {
                    return route
                        .slice('__'.length) // remove prefixed underscores
                        .replace(/\.astro$/, ''); // remove .astro extension
                });

                for (let route of devOnlyRouteNames) {
                    injectRoute({
                        pattern: `/${route}`,
                        entryPoint: `virtual:astro-dev-only-routes?${route}.astro`,
                    });
                }

                updateConfig({
                    vite: {
                        plugins: [getVitePlugin()],
                    },
                } as AstroConfig);
            },
        },
    };
}

function splitVirtualModuleRequest(request: string) {
    const [id, ...rest] = request.split('?');
    const query = rest.join('?');
    return [id, query];
}

const dateTimeFormat = new Intl.DateTimeFormat([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
});

// function log(
//     type: 'info' | 'warn' | 'error',
//     message: string,
//     /**
//      * If true, don't log anything. Errors should not be silenced.
//      */
//     silent: boolean = false
// ) {
//     if (silent) return;
//     const date = dateTimeFormat.format(new Date());
//     const messageColor =
//         type === 'error'
//             ? kleur.red
//             : type === 'warn'
//             ? kleur.yellow
//             : kleur.cyan;
//     console.log(
//         `${kleur.gray(date)} ${messageColor(
//             kleur.bold('[astro-default-preprender]')
//         )} ${messageColor(message)}`
//     );
// }
