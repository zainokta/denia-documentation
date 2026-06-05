import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const GITHUB_REPO = 'https://github.com/zainokta/denia';

const config: Config = {
  title: 'Denia',
  tagline: 'A Docker-free, single-node PaaS that runs your services on a Denia-owned Linux runtime',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  // Production URL — placeholder until a docs host is chosen.
  url: 'https://denia.dev',
  baseUrl: '/',

  organizationName: 'zainokta',
  projectName: 'denia',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },
  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      {
        docs: {
          // Docs ARE the site: served at the root, content under content/.
          path: 'content',
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: `${GITHUB_REPO}/tree/main/`,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/logo512.png',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Denia',
      logo: {
        alt: 'Denia',
        src: 'img/logo192.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          position: 'left',
          label: 'Docs',
        },
        {
          to: '/reference/api/v1',
          label: 'API',
          position: 'left',
        },
        {
          href: GITHUB_REPO,
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {label: 'Introduction', to: '/'},
            {label: 'Getting Started', to: '/getting-started/installation'},
            {label: 'Configuration', to: '/reference/configuration'},
            {label: 'API Reference', to: '/reference/api/v1'},
          ],
        },
        {
          title: 'Architecture',
          items: [
            {label: 'Overview', to: '/architecture/overview'},
            {label: 'Runtime Isolation', to: '/architecture/runtime-isolation'},
            {label: 'Design Decisions', to: '/architecture/design-decisions'},
          ],
        },
        {
          title: 'More',
          items: [
            {label: 'GitHub', href: GITHUB_REPO},
            {label: 'License (Apache 2.0)', href: `${GITHUB_REPO}/blob/main/LICENSE`},
          ],
        },
      ],
      copyright: `Denia is licensed under Apache 2.0. Docs built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.oneLight,
      darkTheme: prismThemes.oneDark,
      additionalLanguages: ['rust', 'toml', 'bash', 'json', 'ini'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
