import { defineConfig } from 'astro/config';
import astroDevPreviewRoutes from 'astro-dev-preview-routes';

// https://astro.build/config
export default defineConfig({
    integrations: astroDevPreviewRoutes(),
});
