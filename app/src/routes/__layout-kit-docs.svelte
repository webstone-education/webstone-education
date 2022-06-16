<script context="module">
  export const prerender = true;

  export const load = createKitDocsLoader({
    sidebar: {
      '/': null,
      '/course': '/course',
    },
  });
</script>

<script>
  import '@svelteness/kit-docs/client/polyfills/index.js';
  import '@svelteness/kit-docs/client/styles/normalize.css';
  import '@svelteness/kit-docs/client/styles/fonts.css';
  import '@svelteness/kit-docs/client/styles/theme.css';
  import '@svelteness/kit-docs/client/styles/vars.css';

  import { page } from '$app/stores';
  import WebstoneLogo from '$img/webstone-logo.svg?raw';

  import {
    Button,
    KitDocs,
    KitDocsLayout,
    SocialLink,
    createKitDocsLoader,
    createSidebarContext,
  } from '@svelteness/kit-docs';

  /** @type {import('@svelteness/kit-docs').MarkdownMeta | null} */
  export let meta = null;

  /** @type {import('@svelteness/kit-docs').ResolvedSidebarConfig | null} */
  export let sidebar = null;

  /** @type {import('@svelteness/kit-docs').NavbarConfig} */
  const navbar = {
    links: [{ title: 'Course', slug: '/course', match: /\/course/ }],
  };

  const { activeCategory } = createSidebarContext(sidebar);

  $: category = $activeCategory ? `${$activeCategory}: ` : '';
  $: title = meta ? `${category}${meta.title} | Webstone Education` : null;
  $: description = meta?.description;
</script>

<svelte:head>
  {#key $page.url.pathname}
    {#if title}
      <title>{title}</title>
    {/if}
    {#if description}
      <meta name="description" content={description} />
    {/if}
  {/key}
</svelte:head>

<KitDocs {meta}>
  <KitDocsLayout {navbar} {sidebar}>
    <div class="logo" slot="navbar-left">
      <Button href="/">
        {@html WebstoneLogo}
      </Button>
    </div>

    <div class="socials" slot="navbar-right-alt">
      <SocialLink type="twitter" href="https://twitter.com/webstonehq" />
      <SocialLink type="discord" href="https://discord.gg/jGQjZXwbEB" />
      <SocialLink type="gitHub" href="https://github.com/WebstoneHQ/platform" />
    </div>

    <slot />
  </KitDocsLayout>
</KitDocs>

<style>
  .socials {
    display: flex;
    margin-left: -0.25rem;
  }

  :global(:root) {
    --kd-color-brand-rgb: 233, 127, 6;
  }

  :global(:root.dark) {
    --kd-color-brand-rgb: 213, 149, 76;
  }

  .logo :global(a) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .logo :global(svg) {
    height: 36px;
    overflow: hidden;
  }
</style>
