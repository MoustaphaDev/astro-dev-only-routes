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
                    log('warn', 'No dev-only routes found.');
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
                    // BUG in astro: deeply nested index.astro routes collide with root index.astro
                    // Open an issue
                    // const filename = routePath.slice(
                    //     routePath.lastIndexOf('/') + 1
                    // );
                    // if (filename === 'index') {
                    //     filename = ''
                    // }
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
                const devOnlyRoutesTreeView = createTreeView(
                    foldersToConsumableTree(devOnlyFiles)
                );
                log(
                    'info',
                    `Found ${devOnlyRoutesCount} dev-only route${
                        devOnlyRoutesCount > 1 ? 's' : ''
                    }. Here they are:\n${kleur.bold(devOnlyRoutesTreeView)}`
                );
            },
        },
    };
}

function log(
    type: 'info' | 'warn' | 'error',
    message: string,
    silent: boolean = false
) {
    if (silent) return;
    const date = new Date().toLocaleTimeString();
    const bgColor =
        type === 'error'
            ? kleur.bgRed
            : type === 'warn'
            ? kleur.bgYellow
            : kleur.bgMagenta;
    type === 'error';
    console.log(
        `${kleur.gray(date)}\n${bgColor(
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

// TODO: make this
function createTreeView(tree, indent = 0) {
    const BRANCH = kleur.magenta('├─');
    const HALF_BRANCH = kleur.magenta('└─');
    const DOWN_TRIANGLE = '▼';

    let result = '';
    const keys = Object.keys(tree);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = tree[key];
        const isLastKey = i === keys.length - 1;
        const maybeDownTriangle = isDir(value) ? DOWN_TRIANGLE : ' ';
        const padding = '   '.repeat(indent);
        const branch = isLastKey ? HALF_BRANCH : BRANCH;
        result += `${padding} ${branch} ${maybeDownTriangle} ${key}\n`;
        if (typeof value === 'object') {
            result += createTreeView(value, indent + 1);
        } else {
            result += `${padding}${branch} ${value}\n`;
        }
    }
    return result;
}

function isDir(tree) {
    return Object.keys(tree).length > 0;
}
