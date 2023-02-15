import { defineConfig } from 'astro/config';
import astroDevPreviewRoutes from '../packages/integration/dist';

// https://astro.build/config
export default defineConfig({
    integrations: [astroDevPreviewRoutes()],
});
