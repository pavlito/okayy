import type { ReactElement } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Confirmer } from 'affirm';
import 'affirm/styles.css';
import '../style.css';
import '../globals.css';

export default function App({ Component, pageProps }: AppProps): ReactElement {
  return (
    <>
      <Head>
        <title>affirm</title>
        <meta name="description" content="A beautiful confirm dialog for React. One function call, type-safe, and fully customizable." />
      </Head>
      <Component {...pageProps} />
      <Confirmer theme="system" />
    </>
  );
}
