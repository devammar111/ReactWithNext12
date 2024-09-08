import Image from 'next/image';
import styles from './entryBanner.module.scss';
import React, { useRef, useState } from 'react';
import Rte from '../../rte';
import { WidgetModel } from '../../../../../../lib/umbraco/types/widgetModel.type';
import { VideoModel } from '../../../../../../lib/umbraco/types/videoModel.type';
import { FlexibleLinkModel } from '../../../../../../lib/umbraco/types/flexibleLinkModel.type';
import { getAbsoluteMediaUrl, GetCroppedImage, getCropUrl } from '../../../../../../lib/umbraco/util/helpers';
import { ImageModel } from '../../../../../../lib/umbraco/types/imageModel.type';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import VideoModal from '@components/videoModal/videoModal';
import WidgetWrapper from '../widgetWrapper';
import FlexibleLink from '@components/links/flexibleLink';
import { useCurrentPageContext } from '@components/layout/layout';
import moment from 'moment';
import SocialBlock from '@components/socialBlock/socialBlock';
import useScreenWidth from 'common/util/useScreenWidth';

export type EntryBannerData = {
    backgroundImage: ImageModel,
    text: string,
    sideImage?: ImageModel,
    fillBackgroundWithSideImage: boolean,
    sideImageHeight?: number,
    sideImageWidth?: number,
    video: VideoModel,
    videoText: string,
    videoPlayPrompt: string,
    linksLabel: string,
    links: FlexibleLinkModel[],
    locationLabel?: string,
    locationLinkText?: string,
    locationUrl?: string,
    backgroundPaper: ImageModel,

}

export default function EntryBanner(model: WidgetModel) {    
    var data = model.content as EntryBannerData;
    const videoThumbnail = useRef<HTMLAnchorElement>(null);
    const [videoOpen, setVideoOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const page = useCurrentPageContext();
    if (!data.sideImageWidth && data.sideImage?.width) {
        data.sideImageWidth = data.sideImage.width;
    }
    if (!data.sideImageHeight && data.sideImage?.height) {
        data.sideImageHeight = data.sideImage.height;
    }
    var variants : Variants | undefined;

    const { width } = useScreenWidth();

    const openVideo = () => {
        setVideoOpen(true);     

        const width = Math.min(window.innerWidth, 1380);
        if (videoThumbnail.current) {
            const pos = videoThumbnail.current.getBoundingClientRect();
            variants = {
                expanded: {
                    width: Math.min(window.innerWidth, 1380),
                    height: (width / pos.width) * pos.height,

                },
                default: {}
            }
        }
    }

    const closeVideo = () => {
        setVideoOpen(false);
    }

    const handleIframeLoad = () => {
        setIsLoading(false);
    };

    const getLayout = () => {
        switch (model.layout) {
            case "Social":
                const backgroundImage = {
                    backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.66) 0%, rgba(0,0,0,0)), url('${getCropUrl(data.backgroundImage, 'shortFullWidth')}')`
                };
                const backgroundPaperStyle = {
                    backgroundImage: `url('${getCropUrl(data.backgroundPaper)}')`,
                };
                const date = moment(page.properties.publishDate);
                const eventStartDate = moment(page.properties.startDate);
                let eventDay = eventStartDate.format('D');
                let eventMonth = eventStartDate.format('MMMM');
                let eventYear = eventStartDate.format('yyyy');
                if (model.variant === 'Event') {
                    const eventEndDate = moment(page.properties.endDate);
                    if (eventStartDate.format('yyyy') != eventEndDate.format('yyyy')) {
                        eventYear = eventStartDate.format('yyyy') + " - " + eventEndDate.format('yyyy');
                    }
                    if (eventStartDate.format('MMMM') != eventEndDate.format('MMMM') ||
                        eventStartDate.format('yyyy') != eventEndDate.format('yyyy'))
                    {
                        eventMonth = eventStartDate.format('MMMM') + "  -  " + eventEndDate.format('MMMM');
                    }
                    if (eventStartDate.format('D') != eventEndDate.format('D')) {
                        eventDay = eventStartDate.format('D') + "  -  " + eventEndDate.format('D');
                    }
                }
                return (
                    <>
                    <div className={styles.background} style={backgroundImage}></div>
                        <div className={styles.wrapper}>
                            <div className={styles.content + ' grid-container'}>
                                {model.variant === 'Event' &&
                                    <div className={styles.text}>
                                        <Rte className='darkBackground' text={data.text} />
                                        <div className='small-margin-bottom-1 hide-for-large'>
                                            <SocialBlock label='Share'></SocialBlock>
                                        </div>
                                        <div className={styles.date} style={backgroundPaperStyle}>
                                            <h5 className='blueText'>{eventMonth}</h5>
                                            <h1 className='redText'>{eventDay}</h1>
                                            <h5 className={styles.dateSpace + " blueText"}>{eventYear}</h5>
                                            <h5 className='blueText'>{data.locationLabel}</h5>
                                            <a rel="noreferrer" href={data.locationUrl} target="_blank">{data.locationLinkText}</a>
                                        </div>
                                    </div>
                                }
                                {model.variant === 'Social' &&
                                    <div className={styles.text}>
                                        <div>
                                            <Rte className='darkBackground' text={data.text} />
                                            <div className='small-margin-bottom-1 hide-for-large'>
                                                <SocialBlock label='Share'></SocialBlock>
                                            </div>
                                            <h5 className={'darkBackground '+styles.publishDate}>{date.format('MMMM D, yyyy')}</h5>
                                        </div>
                                        <h5 className={styles.author}>by {page.properties.author}</h5>
                                    </div>
                                }
                                {data.sideImage &&
                                    <div className={styles.thumbnail + ' hide-for-small-only hide-for-medium-only'}>
                                        {GetCroppedImage(data.sideImage, 'thumbnail')}
                                    </div>
                                }
                            </div>
                            <div className={styles.socialContainer + ' hide-for-small-only hide-for-medium-only'}>
                                <SocialBlock label='Share'></SocialBlock>
                            </div>
                        </div>

                    </>
                )
            default:
            
                const sideBackgroundStyle = {
                    backgroundImage: data.sideImage ? `url('${data.fillBackgroundWithSideImage ? getCropUrl(data.sideImage, "background") : getAbsoluteMediaUrl(data.sideImage.url)}')` : undefined,
                    minHeight: width < 1024 ? '100vh' : data.sideImageHeight
                };
            
                const rightImageStyle = {
                    backgroundImage: `url('${getCropUrl(data.backgroundImage, 'rightSideShort', data.backgroundImage?.width, data.backgroundImage?.height)}')`
                };
                return (
                    <>
                        <div className={styles.side + (data.fillBackgroundWithSideImage ? ' ' + styles.fill : '') + ' blueBackground '} style={sideBackgroundStyle}>
                            <div className={styles.sideContainer}>
                                <div className={width <= 1460 ? ' grid-container ' : styles.sideInnerCtn}>
                                    <div className={styles.sideHeader}><Rte className={(model.variant === "Basic" ? "" : "small-margin-bottom-2 medium-margin-bottom-3 ")} text={data.text} /></div>
                                    {data.video && !!data.video.thumbnailUrl &&
                                        <div>
                                            <motion.a layoutId={'video'} className={styles.video} onClick={openVideo} variants={variants} animate={videoOpen ? 'expanded' : 'default'} ref={videoThumbnail}>
                                                <Image src={data.video.thumbnailUrl} width={data.video.thumbnailWidth} height={data.video.thumbnailHeight} layout="responsive" alt={data.video.authorName} />
                                            </motion.a>
                                            <Rte text={data.videoText} />
                                            {model.variant === "WithVideo" &&            
                                                <a className={styles.playLink} onClick={openVideo}><i className="bmg-icon bmg-icon-play"></i>{data.videoPlayPrompt}</a>
                                            }
                                        </div>
                                    }
                                    {data.links && data.links.length &&
                                        <div className={styles.links}>
                                            <h6 className="small-margin-bottom-1">{data.linksLabel}</h6>
                                            <ul className="no-bullet">
                                                {data.links.map((link, index) =>
                                                    <li key={index}>
                                                        <h4 className="noMargin">
                                                            <FlexibleLink link={link} />
                                                        </h4>
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className={styles.imageContainer + ' hide-for-small-only'} style={rightImageStyle}></div>
                        {data.video &&
                            <VideoModal open={videoOpen} video={data.video} onClose={closeVideo} />
                        }
                    </>
                )
        }
    }

    return (
        <WidgetWrapper styles={styles} model={model}>
            {getLayout()}
        </WidgetWrapper>
    )
}