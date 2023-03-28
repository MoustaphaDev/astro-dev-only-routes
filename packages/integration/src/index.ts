import type { AstroIntegration } from 'astro';
import { fileURLToPath } from 'url';
import { globbySync } from 'globby';
import kleur from 'kleur';

// const pageExtRE = /\.(astro|mdx|md|tsx|ts|jsx|js)$/; Support later
const pageExtRE = /\.astro$/;
export default function integration(): AstroIntegration {
    return {
        name: 'astro-dev-only-routes',
        hooks: {
            'astro:config:setup': ({ injectRoute, config, command }) => {
                if (command === 'build') {
                    return;
                }
                let pagesDir = new URL('./src/pages', config.root);

                // TODO: support .mdx, .md, .ts, .js
                let devOnlyRoutes = globbySync(
                    ['**/__*.astro', '**/__*/**/*.astro'],
                    {
                        cwd: pagesDir,
                    }
                ).map((route) => {
                    console.log({ route });
                    const firstIndexOfDoubleUnderscore = route.indexOf('__');

                    const pagesDirRelativePath = route.slice(
                        0,
                        firstIndexOfDoubleUnderscore
                    );
                    const routePath = route
                        .slice(firstIndexOfDoubleUnderscore + '__'.length)
                        .replace(pageExtRE, '');

                    return { routePath, pagesDirRelativePath };
                });

                console.log({ devOnlyRoutes });

                for (let { routePath, pagesDirRelativePath } of devOnlyRoutes) {
                    if (routePath === 'index') {
                        routePath = '';
                    }
                    const entryPoint = `${fileURLToPath(
                        pagesDir
                    )}/__${routePath}.astro`;
                    const pattern = `/${pagesDirRelativePath}${routePath}`;

                    injectRoute({
                        entryPoint,
                        pattern,
                    });
                }
            },
        },
    };
}

const dateTimeFormat = new Intl.DateTimeFormat([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
});

function log(
    type: 'info' | 'warn' | 'error',
    message: string,
    /**
     * If true, don't log anything. Errors should not be silenced.
     */
    silent: boolean = false
) {
    if (silent) return;
    const date = dateTimeFormat.format(new Date());
    const messageColor =
        type === 'error'
            ? kleur.red
            : type === 'warn'
            ? kleur.yellow
            : kleur.cyan;
    console.log(
        `${kleur.gray(date)} ${messageColor(
            kleur.bold('[astro-default-preprender]')
        )} ${messageColor(message)}`
    );
}
