import NodeTile from "@components/nodeTile/nodeTile";
import { UmbracoNode } from "@lib/umbraco/types/umbracoNode.type";
import { WidgetModel } from "@lib/umbraco/types/widgetModel.type";
import { useCollection } from "@lib/umbraco/util/publicDataApi";
import { Swiper, SwiperSlide } from 'swiper/react';
import WidgetWrapper from "../../widgetWrapper";
import { CarouselModel } from "../carousel";
import variables from "@styles/variables.module.scss";
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from "swiper";
import internal from "stream";
import { useCurrentPageContext } from "@components/layout/layout";
import styles from "./nodeCarousel.module.scss";
import { Swiper as SwiperRef } from "swiper";
import { LegacyRef, useRef, useState } from "react";
import CircleLink from "@components/links/circleLink";
import Rte from '@components/grid/controls/rte';

export default function NodeCarousel(model: WidgetModel) {
    const widgetData = model.content as CarouselModel;
    const page = useCurrentPageContext();
    const {data, error, mutate, isValidating} = useCollection(page.id, 1, widgetData.maxSlides || 0, widgetData.sources?.map(source => source.id), widgetData.query, widgetData.allowedTypes);
    const loadingInitData = !data && !error;
    const medium = parseInt(variables.breakpointMedium);
    const large = parseInt(variables.breakpointLarge);
    const xlarge = parseInt(variables.breakpointXLarge);
    const navigationPrevRef = useRef<HTMLDivElement>(null);
    const navigationNextRef = useRef<HTMLDivElement>(null);
    let titleClass = "";
    const initSwiper = (swiperInstance : SwiperRef) => {
        if (typeof swiperInstance.params.navigation) {
            const originalNav = swiperInstance.params.navigation
            swiperInstance.params.navigation = {
                ...(originalNav as Record<string, unknown>),
                prevEl: navigationPrevRef.current as HTMLElement,
                nextEl: navigationNextRef.current as HTMLElement
            }
        }

        swiperInstance.navigation.destroy();
        swiperInstance.navigation.init();
        swiperInstance.navigation.update();        
    }
    
    const breakpoints : { [key: number] : any} = {};
    breakpoints[0] = {
        spaceBetween: 24,
        slidesPerView: widgetData.slidesVisibleOnSmallScreens,
        slidesPerGroup: widgetData.slidesVisibleOnSmallScreens
    };
    breakpoints[medium] = {
        spaceBetween: 50,
        slidesPerView: widgetData.slidesVisibleOnMediumScreens,
        slidesPerGroup: widgetData.slidesVisibleOnMediumScreens
    };
    breakpoints[large] = {
        spaceBetween: 56,
        slidesPerView: widgetData.slidesVisibleOnLargeScreens,
        slidesPerGroup: widgetData.slidesVisibleOnLargeScreens
    };
    if (model.variant === "News" && page.urlSegment == "media-center" || model.variant === "Mixture") {
        titleClass = styles.newTitle
    }
    return (
        <WidgetWrapper model={model} className={styles.nodeCarousel} styles={styles}>
            <div className="grid-container">
            { model.content.title && 
                <h3 className={titleClass}>{model.content.title}</h3>
            }
            { model.content.customTitle && 
                <Rte text={model.content.customTitle} />
            }
            <Swiper 
                className={styles.nodeSwiper} 
                modules={[Navigation]} 
                slidesPerView={widgetData.slidesVisibleOnSmallScreens} 
                breakpoints={breakpoints}
                onSwiper={initSwiper}
                >
                    {widgetData.items && widgetData.items.length > 0 ?
                        widgetData.items?.map(item => (
                            <SwiperSlide key={'slide-' + item.id}>
                                <NodeTile content={item} />
                            </SwiperSlide>
                        ))
                        : data?.map(item => (
                            <SwiperSlide key={'slide-' + item.id}>
                                <NodeTile content={item} />
                            </SwiperSlide>
                        )) }
                {}
                {navigationNextRef && navigationPrevRef && (
                    <>
                        <div className={styles.swiperprev + ' hidden-chervon'} ref={navigationPrevRef}>
                            <i className="bmg-icon bmg-icon-chevron-left" />
                        </div>
                        <div className={styles.swipernext} ref={navigationNextRef}>
                            <i className="bmg-icon bmg-icon-chevron-right" />
                        </div>
                    </>
                )}
            </Swiper>
            { widgetData.followUpLink && 
                <div className={styles.linkContainer + ' small-margin-top-1 medium-margin-top-2 large-margin-top-3'}>
                    <CircleLink link={widgetData.followUpLink} />
                </div>
            }
            </div>
        </WidgetWrapper>
    )
}