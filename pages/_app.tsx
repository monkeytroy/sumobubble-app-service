import '@/styles/globals.css'
import type { AppContext, AppInitialProps, AppLayoutProps, AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import 'react-toastify/dist/ReactToastify.css';
import { ReactElement, ReactNode, ReactNodeArray } from 'react';
import { NextComponentType } from 'next';
import Layout from '@/components/layout';

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