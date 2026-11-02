import { defineConfig } from 'astro/config';

// Served at https://thegobone.github.io/gobs-jobs/ until a custom domain exists.
// With a custom domain: set site to it, remove `base`, and add public/CNAME.
export default defineConfig({
  site: 'https://thegobone.github.io',
  base: '/gobs-jobs',
});
