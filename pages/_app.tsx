import '../styles/globals.scss'
import type { AppProps } from 'next/app';
const NProgress = require('nprogress');
import { createContext, useContext, useEffect } from 'react';

const RefererContext = createContext<string>('');

export const useRefererContext = () => {
    return useContext(RefererContext);
}
function MyApp({ Component, pageProps, router }: AppProps) {
    const showProgress = () => {
        NProgress.start();
    }

    const hideProgress = () => {
        NProgress.done();
    }

    useEffect(() => {
        router.events.on('routeChangeStart', showProgress);
        router.events.on('routeChangeComplete', hideProgress);
        router.events.on('routeChangeError', () => hideProgress);
        return () => {
            router.events.off('routeChangeStart', showProgress);
            router.events.off('routeChangeComplete', hideProgress);
            router.events.off('routeChangeError', hideProgress)
        }
    })
    const animation  = {
        variants: {
            initial: {
                opacity: 0,
                x: 0
            },
            animate: {
                opacity: 1,
                x: 0
            },
            exit: {
                x: '100%'
            },
        },
        transition: {
            duration: .6
        }
    }
    if (router.route.indexOf('[[...slug]]') === -1) {
        return <Component {...pageProps} />
    }
    
    return (
        <Component {...pageProps}/>
    )
}

export default MyApp
