import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import svelte from "@astrojs/svelte";

import { makeLocalesConfig } from './config/locales';
import { makeSidebar } from './config/sidebar';

// https://astro.build/config
export default defineConfig({
  integrations: [starlight({
    logo: {
      light: "./src/assets/webstone-logo-light.svg",
      dark: "./src/assets/webstone-logo-dark.svg",
      replacesTitle: true,
    },
    title: 'Webstone Education',
    locales: makeLocalesConfig(),
    sidebar: makeSidebar(),
    social: {
      github: 'https://github.com/withastro/starlight'
    },
    defaultLocale: "en",
  }), svelte()],
  vite: {
    resolve: {
      preserveSymlinks: true
    }
  }
});