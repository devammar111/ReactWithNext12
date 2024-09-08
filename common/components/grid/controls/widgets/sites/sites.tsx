import { getCropUrl, getMediaDimensions } from "@lib/umbraco/util/helpers";
import { ImageModel } from "@lib/umbraco/types/imageModel.type";
import { WidgetModel } from "@lib/umbraco/types/widgetModel.type";
import Rte from "../../rte";
import WidgetWrapper from "../widgetWrapper";
import { useEffect, useRef, useState } from "react";
import styles from './sites.module.scss';
import Link from "next/link";
import { gsap } from "@lib/greensock/all";

import { useRouter } from "next/router";
import siteItem from "@lib/umbraco/types/site.type";
import { motion } from "framer-motion";

function Tab({ content, active, tabIndex }: {
    content: siteItem,
    active: boolean,
    tabIndex: number
}) {
    if (!active) {
        return null;
    }

    return (
        <motion.div initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
        >
            {content.text &&
                <Rte text={content.text} />
            }
        </motion.div>
    )
}
export type SitesModel = {
    background: ImageModel,
    title: string,
    siteItems: siteItem[]
}
export default function Sites(model: WidgetModel) {
    const router = useRouter();
    const imagesRef = useRef<Array<HTMLDivElement | null>>([]);
    const animated = useRef(false);
    var { title, siteItems, } = model.content as SitesModel;
    const [active, setActive] = useState(0);
    const [isAnimationComplete, setIsAnimationComplete] = useState(false);
    siteItems.map((item, index) => (
        item.imageURL = getCropUrl(item.image, 'sitesBackground')
    ));
    useEffect(() => {
        var index = 0;
        if (router.asPath.indexOf('#') > -1) {
            const hash = router.asPath.split('#')[1];
            index = siteItems.findIndex(x => x.segment === hash);
        }

        if (router.asPath.indexOf('#') > -1) {

            const selectedBackground = imagesRef.current[index];
            const prevBackground = imagesRef.current[active];
            setActive(index);

            if (selectedBackground && prevBackground) {
                const prevImage = prevBackground;
                const currentImage = selectedBackground;
                if (prevImage != currentImage) {
                    setIsAnimationComplete(true);

                    // Create a timeline for the fade in/out animation
                    const tl = gsap.timeline();

                    // Fade out the previous image (if any)
                    tl.fromTo(prevImage, { x: '0%', autoAlpha: 1 }, { x: '0%', autoAlpha: 0, duration: 0.7 });

                    // Fade in the current image
                    tl.fromTo(currentImage, { x: '0%', autoAlpha: 0.8 }, { x: 0, autoAlpha: 1, duration: 1, delay: -0.7 });

                    // Set the flag to true to indicate that the animation has been performed
                    animated.current = true;

                    // Play the timeline
                    tl.play();
                }

            }
            setTimeout(
                () => setIsAnimationComplete(false),
                1000
            );

        }

    }, [router]);
    return (
        <WidgetWrapper className={styles.wrapperContainer + " fullHeight darkBackground"} model={model} styles={styles}>

            {siteItems &&
                siteItems.map((item, index) => {
                    if (item.image) {
                        let imageStyle: NodeJS.Dict<any> = {};
                        let gradient90Degree = 'linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,0,0,0) 50%)';
                        let gradient290Degree = 'linear-gradient(to left, rgba(0,0,0,1), rgba(0,0,0,0) 60%)';
                        let backgroundImageObj: NodeJS.Dict<any> = {};
                        if (model.layout == "LeftAligned") {
                            if (item.image) {

                                backgroundImageObj.backgroundImage = `${gradient90Degree},url('${item.imageURL}')`;
                            }
                            else {
                                if (index == 0) {
                                    backgroundImageObj.backgroundImage = `${gradient90Degree},url('${getCropUrl(siteItems[0]?.image, 'sitesBackground')}')`;

                                }

                            }

                        }
                        else {
                            if (item?.image) {
                                backgroundImageObj.backgroundImage = `${gradient290Degree},url('${item.imageURL}')`;
                            }
                            else {
                                if (index == 0) {
                                    backgroundImageObj.backgroundImage = `${gradient290Degree},url('${getCropUrl(siteItems[0]?.image, 'sitesBackground')}')`;
                                }
                            }


                        }
                        return (
                            <>
                                <div key={'image-' + index}>
                                    <div ref={el => imagesRef.current[index] = el} className={(index === active ? styles.showImage : styles.hideImage + ' ' + styles.hidingImage) + ' ' + styles.imageDiv} style={backgroundImageObj}>
                                    </div>
                                </div>


                            </>

                        )
                    }
                }
                )
            }

            <div className={styles.container + " grid-container"}>
                <div className={styles.contentContainer + " large-5 medium-12 small-12 cell"}>
                    <h3>{title}</h3>
                    <div className={`${styles.grid} grid-x grid-margin-x small-up-1 medium-up-1 large-up-2`}>
                        {siteItems &&
                            siteItems.map((item, index) =>
                                <div key={'linkBar-' + index} className={styles.cell + ' cell'}>
                                    <Link href={'#' + item.segment}>
                                        <a className={(index === active ? styles.active : undefined) + ' ' + (isAnimationComplete ? styles.disableLink : '')}><span className={styles.customLink}>{index + 1}</span><span className={styles.linkText}>{item.label}</span></a>
                                    </Link>
                                </div>
                            )
                        }
                    </div>

                    {siteItems &&
                        <div className={styles.tabsContent + " small-margin-bottom-2 medium-margin-bottom-3 medium-margin-top-1 small-margin-top-1"}>
                            {siteItems.map((item, index) => (
                                <div key={'textBar-' + index}>
                                    <div className={'index-' + index}
                                    >
                                        <Tab content={item} active={index === active} tabIndex={index} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    }
                </div>
            </div>
        </WidgetWrapper>
    )
}