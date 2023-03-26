import { defineConfig } from 'astro/config';
import astroDevOnlyRoutes from 'astro-dev-only-routes';

// https://astro.build/config
export default defineConfig({
    integrations: [astroDevOnlyRoutes()],
});
