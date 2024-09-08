import { IconLinkModel } from "../../../../../../lib/umbraco/types/iconLinkModel.type";
import ImageLinkModel from "../../../../../../lib/umbraco/types/imageLinkModel.type";
import { ImageModel } from "../../../../../../lib/umbraco/types/imageModel.type";
import { WidgetModel } from "../../../../../../lib/umbraco/types/widgetModel.type";
import { getAbsoluteMediaUrl, getCropUrl, getMediaDimensions } from "@lib/umbraco/util/helpers";
import IconLink from "../../../../links/iconLink";
import ImageLink from "../../../../links/imageLink";
import Rte from "../../rte";
import styles from './columnLinks.module.scss';
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@lib/greensock/all";
import WidgetWrapper from "../widgetWrapper";
import TitleTextPair from "@lib/umbraco/types/titleTextPair.type";
gsap.registerPlugin(ScrollTrigger);

export type ColumnLinksModel = {
    leftSideText: string,
    images: ImageModel[],
    rightSideText: string,
    leadIn?: string,
    links?: ImageLinkModel[],
    iconLinks?: IconLinkModel[],
    baseImage?: ImageModel,
    values?: TitleTextPair[],
    background?: ImageModel
}

export default function ColumnLinks(model: WidgetModel) {
    const ref = useRef<HTMLDivElement>(null);
    const animated = useRef(false);
    const data = model.content as ColumnLinksModel;
    const variant = model.variant.replace(/ /g,"");
    const isTileLinks = variant === 'TileLinks';    
    
    const sizes = {
        "portrait": getMediaDimensions(data.images[0], "portrait") || { width: 0, height: 0 },
        "landscape": getMediaDimensions(data.images[0], "landscape") || { width: 0, height: 0 }
    }

    let background = {
        backgroundImage: data.background ? "url('" + getAbsoluteMediaUrl(data.background?.url) + "')" : '',
        backgroundSize: 'cover',
    }

    if (isTileLinks) {
        background = Object.assign(background, {
            backgroundBlendMode: 'multiply',
            backgroundColor: '#E2EADE',
        })
    }

    const iconContent = {
        backgroundImage: data.baseImage ? "url('" + getAbsoluteMediaUrl(data.baseImage?.url) + "')" : '',
        // position: 'absolute' as 'absolute',
        // width : '328px',
        // height: '80%',
        // left : '1322px',
        // backgroundRepeat: 'no-repeat',
        // backgroundPosition: '0% 0%',
        // backgroundSize: '100% 100%'
    }

    useEffect(() => {
        const element = ref.current;
        if (element && !animated.current) {
            const container = element.querySelector('.imageContainer');
            const images = container?.querySelectorAll('div');
            if (container && images) {
                const image1 = images[0];
                const image2 = images[1];
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: images[0],
                        start: 'top 40%',
                        invalidateOnRefresh: true
                    },
                    paused: true
                })
                    .fromTo(image1, { x: '-50%', autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: .5 })
                    .fromTo(image2, { y: '50%', autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .5, delay: -.2 });
                animated.current = true;
            }
        }
    }, [])
    var alternateGrid = (data.values && data.values.length) || (data.iconLinks && data.iconLinks.length);
    return (
        <div ref={ref} style={background} >
            <WidgetWrapper className="fullHeight" model={model} styles={styles}>
                <div className={styles.newContainerContent + " " + styles[variant] + " grid-container"}>
                    {data.baseImage &&
                        <div className={styles.imageWrapper}>
                            <div className={styles.newRightIcon} style={{ width: `${data.baseImage.width}px`, height: `${data.baseImage.height}px` }}>
                                <Image src={getAbsoluteMediaUrl(data.baseImage.url)} width={data.baseImage.width} height={data.baseImage.height} layout="responsive" alt={data.baseImage.name} />
                            </div>
                        </div>
                    }
                    <div className={styles.newContent}>
                        <div className={styles.leftContainer}>
                            <div className={styles.titleContainer}>
                                <Rte className={styles.rte + ' ' + styles.title + ' rte'} text={data.leftSideText} />
                            </div>
                            <div className={styles.imageContainer + ' imageContainer'}>
                                {data.images &&
                                    data.images.map((image, index) => {
                                        const crop = index % 2 === 0 ? "landscape" : "portrait";
                                        const size = sizes[crop]
                                        return (
                                            <div key={'image-' + index} className={styles[crop] + ' ' + styles.image}>
                                                <Image src={getCropUrl(image, crop)} width={size.width} height={size.height} layout="responsive" alt={image.name} />
                                            </div>
                                        )
                                    }
                                    )
                                }
                            </div>
                        </div>
                        <div className={styles.rightContainer}>
                            {isTileLinks &&
                                <Rte className={styles.rte + ' rte small-padding-bottom-1'} text={data.rightSideText} />
                            }
                            {data.leadIn &&
                                <Rte className="small-margin-bottom-1 medium-margin-bottom-2" text={data.leadIn} />
                            }
                            <div className={`${(alternateGrid ? "small-up-2" : "")} grid-x`}>
                                {data.links &&
                                    data.links.map((link, index) => {
                                        const isSmall = index > 0 || isTileLinks;
                                        const colName = isSmall ? "small-6" : "small-12";
                                        const alias = isSmall ? "portrait" : "landscape";

                                        return (
                                            <div key={'columnLinksRight_' + index} className={colName + " " + styles.cell + " cell"}>
                                                <ImageLink key={index} link={link} crop={alias} />
                                            </div>
                                        )
                                    })
                                }
                                {data.iconLinks &&
                                    data.iconLinks.map((link, index) =>
                                        <div key={'columnLinksRight_' + index} className={styles.cell + " cell"}>
                                            <IconLink className={styles.tileLink} key={index} link={link} />
                                        </div>
                                    )
                                }
                                {data.values &&
                                    data.values.map((value, index) =>
                                        <div key={'columnLinksRight_' + index} className={ styles.cell + " cell small-6"}>
                                            <h5>{value.title}</h5>
                                            <h6>{value.text}</h6>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </WidgetWrapper>
        </div>
    )
}