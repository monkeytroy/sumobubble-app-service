import type { AppContext, AppInitialProps, AppLayoutProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import 'react-toastify/dist/ReactToastify.css';
import { ReactElement } from 'react';
import { NextComponentType } from 'next';
import Layout from '@/components/layout';

import '@/styles/globals.css';
import '@/styles/summary.scss';

const defaultGetLayout = (page: ReactElement) => {
  return (
    <Layout>
      {page}
    </Layout>
  )
}

const App:NextComponentType<AppContext, AppInitialProps, AppLayoutProps> = ({ Component, pageProps: {session, ...pageProps} }: AppLayoutProps) => {

  const getLayout = Component.getLayout || defaultGetLayout; //((page: ReactElement) => page)

  return (
    <SessionProvider session={session}>
      {getLayout(<Component {...pageProps} />)}
    </SessionProvider>
  )

}

export default App;