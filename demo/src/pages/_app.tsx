import type { ReactElement } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Confirmer } from 'okayy';
import 'okayy/styles.css';
import '../style.css';
import '../globals.css';

export default function App({ Component, pageProps }: AppProps): ReactElement {
  return (
    <>
      <Head>
        <title>okayy</title>
      </Head>
      <Component {...pageProps} />
      <Confirmer theme="system" />
    </>
  );
}
