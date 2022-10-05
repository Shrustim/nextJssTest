import '../styles/globals.scss';
import Layout from '../src/components/Layout';
import { store } from '../src/store/store'
import { Provider } from 'react-redux'
import type { AppProps } from 'next/app'
import NProgress from 'nprogress';
import Router from 'next/router';
import ErrorBoundary from '../src/components/ErrorBoundary'
Router.events.on('routeChangeStart', (url) => {
  console.log(`Loading: ${url}`);
  NProgress.start();
});

Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
         <ErrorBoundary>
            <Layout>
                <Component {...pageProps} />
              </Layout>
         </ErrorBoundary>  
    </Provider>
   )
}

export default MyApp
