import type { AstroIntegration } from 'astro';
import { fileURLToPath } from 'url';
import { globbySync } from 'globby';
import kleur from 'kleur';
import treeify from 'treeify';

// const pageExtRE = /\.(astro|mdx|md|tsx|ts|jsx|js)$/; Support later
const pageExtRE = /\.astro$/;
const DOUBLE_UNDERSCORE = '__';
export default function integration(): AstroIntegration {
    return {
        name: 'astro-dev-only-routes',
        hooks: {
            // TODO: handle refresh when new routes are created or deleted
            'astro:config:setup': ({ injectRoute, config, command }) => {
                if (command === 'build') {
                    return;
                }
                let pagesDir = new URL('./src/pages', config.root);

                // TODO: support .mdx, .md, .ts, .js
                const devOnlyFiles = globbySync(
                    [
                        `**/${DOUBLE_UNDERSCORE}*.astro`,
                        `**/${DOUBLE_UNDERSCORE}*/**/*.astro`,
                    ],
                    {
                        cwd: pagesDir,
                    }
                );
                if (devOnlyFiles.length === 0) {
                    log('info', 'No dev-only routes found.');
                    return;
                }
                const devOnlyRoutes = devOnlyFiles.map((route) => {
                    const firstIndexOfDoubleUnderscore =
                        route.indexOf(DOUBLE_UNDERSCORE);

                    const pagesDirRelativePath = route.slice(
                        0,
                        firstIndexOfDoubleUnderscore
                    );
                    const routePath = route
                        .slice(
                            firstIndexOfDoubleUnderscore +
                                DOUBLE_UNDERSCORE.length
                        )
                        .replace(pageExtRE, '');

                    return { routePath, pagesDirRelativePath };
                });

                for (let { routePath, pagesDirRelativePath } of devOnlyRoutes) {
                    if (routePath === 'index') {
                        routePath = '';
                    }
                    const entryPoint = `${fileURLToPath(
                        pagesDir
                    )}/${DOUBLE_UNDERSCORE}${routePath}.astro`;
                    const pattern = `/${pagesDirRelativePath}${routePath}`;

                    injectRoute({
                        entryPoint,
                        pattern,
                    });
                }

                const devOnlyRoutesCount = devOnlyRoutes.length;
                const devOnlyRoutesTreeView = treeify.asTree(
                    foldersToConsumableTree(devOnlyFiles),
                    true,
                    true
                );
                log(
                    'info',
                    `Found ${devOnlyRoutesCount} dev-only route${
                        devOnlyRoutesCount > 1 ? 's' : ''
                    } . Here they are:\n${kleur.bold(devOnlyRoutesTreeView)}`
                );
            },
        },
    };
}

function log(
    type: 'info' | 'warn' | 'error',
    message: string,
    /**
     * If true, don't log anything. Errors should not be silenced.
     */
    silent: boolean = false
) {
    if (silent) return;
    const date = new Date().toLocaleTimeString();
    const bgColor =
        type === 'error'
            ? kleur.bgRed
            : type === 'warn'
            ? kleur.bgYellow
            : kleur.bgCyan;
    type === 'error';
    console.log(
        `${kleur.gray(date)} ${bgColor(
            kleur.bold('[astro-dev-only-routes]')
        )} ${message}`
    );
}

function foldersToConsumableTree(folders: string[]) {
    const tree = {};
    for (let folder of folders) {
        const parts = folder.split('/');
        const rootKey = parts.shift();
        if (!rootKey) {
            continue;
        }
        addNestedKeys(tree, [rootKey, ...parts]);
    }
    return tree;
}

function addNestedKeys(obj: object, keys: string[]) {
    let cursor = obj;
    for (let key of keys) {
        cursor[key] = cursor[key] || {};
        cursor = cursor[key];
    }
}
