import { ThemeSwitch } from './src/components/ThemeSwitch';

export default {
  logo: <span style={{ fontWeight: 800, fontSize: 18 }}>affirm</span>,
  project: {
    link: 'https://github.com/pav-luc/affirm',
  },
  docsRepositoryBase: 'https://github.com/pav-luc/affirm/tree/main/demo',
  useNextSeoProps() {
    return {
      titleTemplate: '%s – affirm',
    };
  },
  search: {
    component: () => null,
  },
  themeSwitch: {
    component: null,
  },
  navbar: {
    extraContent: <ThemeSwitch />,
  },
  feedback: {
    content: null,
  },
  footer: {
    text: (
      <span>
        MIT {new Date().getFullYear()} © affirm
      </span>
    ),
  },
  head: () => (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="A beautiful confirm dialog for React. One function call, type-safe, and fully customizable." />
      <meta name="og:title" content="affirm" />
      <meta name="og:description" content="A beautiful confirm dialog for React." />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="theme-color" content="#000000" />
      <link rel="icon" href="/favicon.ico" />
    </>
  ),
};
