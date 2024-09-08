import Footer from "../footer/footer";
import Header from "../header/header";
import Head from 'next/head'
import Script from "next/script";
import { PageData } from "../../../lib/umbraco/types/pageData.type";
import { DialogProvider } from "../dialogs/dialogProvider";
import { GridSection } from "../../../lib/umbraco/types/gridSection.type";
import Grid from "../grid/grid";
import GlobalDialog from "../dialogs/globalDialog";
import { CommonData } from "@lib/umbraco/types/commonData.type";
import { createContext, useContext, useEffect } from "react";
import { UmbracoNode } from "@lib/umbraco/types/umbracoNode.type";
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import { getAbsoluteMediaUrl } from "@lib/umbraco/util/helpers";
import { AddToCartProvider } from "@components/grid/controls/widgets/productDetail/addToCartProvider";
export type LayoutData = {
    data: PageData,
    children: React.ReactNode,
    preview: boolean
}

const CommonDataContext = createContext<CommonData>(undefined!);
const CurrentPageContext = createContext<UmbracoNode>(undefined!);
const PreviewContext = createContext<boolean>(false);

export const useCommonDataContext = () => {
    return useContext(CommonDataContext);
}

export const useCurrentPageContext = () => {
    return useContext(CurrentPageContext);
}

export const usePreviewContext = () => {
    return useContext(PreviewContext);
}

export default function Layout({ data, children, preview }: LayoutData) {
    const animation = {
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
                x: '-100%'
            },
        },
        transition: {
            duration: .6
        }
    }

    const resetScroll = () => window.scrollTo(0, 0);
    const transparentWidgets = ['EntryBanner'];
    const pageClass = ' ' + data.page.name.replace(' ', '-');
    return (
        <>
            <Head>
                <title>{data.page.properties.seoSettings?.title}</title>
                <meta name="HandheldFriendly" content="True" />
                <meta name="MobileOptimized" content="320" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link rel="stylesheet" href="https://use.typekit.net/msa1mxc.css" />
                <link href="https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&display=swap" rel="stylesheet" />
                <meta name="description" content={data.page.properties.seoSettings?.description} />
                <meta property="og:title" content={data.page.properties.socialSettings?.facebookTitle} />
                <meta property="og:description" content={data.page.properties.socialSettings?.facebookDescription} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={data.page.properties.socialSettings?.twitterTitle} />
                <meta name="twitter:description" content={data.page.properties.socialSettings?.twitterDescription} />
                {data.page.properties.socialSettings?.image &&
                    <>
                        <meta name="og:image" content={getAbsoluteMediaUrl(data.page.properties.socialSettings.image.url) + '?anchor=center&mode=crop&width=1200&height=630&rnd=133052207488900000'} />
                        <meta property="og:image:width" content="1200" />
                        <meta property="og:image:height" content="630" />
                        <meta name="twitter:image" content={getAbsoluteMediaUrl(data.page.properties.socialSettings.image.url) + '?anchor=center&mode=crop&width=750&height=500&rnd=133052207488900000'} />
                    </>
                }
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: data.page.properties.jsonPlusLd }}></script>
            </Head>
            <Script src="https://use.fortawesome.com/93666cc6.js"></Script>
            <DialogProvider>
                <AddToCartProvider>
                    <CommonDataContext.Provider value={data.commonData}>
                        <CurrentPageContext.Provider value={data.page}>
                            <PreviewContext.Provider value={preview}>
                                <Header data={data.commonData} startTransparent={transparentWidgets.includes(data.page.properties.bodyText.rows[0]?.cells[0]?.controls[0]?.value.widget)} />
                                <LazyMotion features={domAnimation}>
                                    <AnimatePresence exitBeforeEnter onExitComplete={resetScroll}>
                                        <m.div key={data.page.id} className={"animationWrapper" + pageClass} initial="initial" animate="animate" exit="exit" transition={animation.transition} variants={animation.variants}>
                                            <main>{children}</main>
                                            <Footer {...data.commonData} />
                                            {preview &&
                                                <a className="previewButton button" href="/api/preview/end/">End Preview</a>
                                            }
                                        </m.div>
                                    </AnimatePresence>
                                </LazyMotion>
                                {data.modals.map(modal => {
                                    var bodyText = modal.properties.bodyText as GridSection;
                                    return (
                                        <GlobalDialog key={'modal-' + modal.id} id={modal.urlSegment} size={modal.properties.size}>
                                            <Grid {...bodyText} />
                                        </GlobalDialog>
                                    )
                                })}
                            </PreviewContext.Provider>
                        </CurrentPageContext.Provider>
                    </CommonDataContext.Provider>
                </AddToCartProvider>
            </DialogProvider>
            <Script id="usersnap" strategy="afterInteractive">
                {`
                    window.onUsersnapLoad = function(api) {
                        api.init();
                      }
                      var script = document.createElement('script');
                      script.defer = 1;
                      script.src = 'https://widget.usersnap.com/global/load/b88c6872-dc3b-4a47-bc0d-298f6e1bf00b?onload=onUsersnapLoad';
                      document.getElementsByTagName('head')[0].appendChild(script);
                `}
            </Script>
        </>
    )
}