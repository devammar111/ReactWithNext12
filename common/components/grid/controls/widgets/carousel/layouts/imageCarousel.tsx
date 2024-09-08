import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Swiper as SwiperRef  } from "swiper";
import WidgetWrapper from "../../widgetWrapper";
import { WidgetModel } from '@lib/umbraco/types/widgetModel.type';
import { CarouselModel } from '../carousel';
import variables from "@styles/variables.module.scss";
import styles from './imageCarousel.module.scss';
import { useRef } from 'react';
import { GetCroppedImage } from '@lib/umbraco/util/helpers';

export default function ImageCarousel(model: WidgetModel) {
    const widgetData = model.content as CarouselModel;
    const medium = parseInt(variables.breakpointMedium);
    const large = parseInt(variables.breakpointLarge);
    const navigationPrevRef = useRef<HTMLDivElement>(null);
    const navigationNextRef = useRef<HTMLDivElement>(null);
    const initSwiper = (swiperInstance: SwiperRef) => {
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

    const breakpoints: { [key: number]: any } = {};
    breakpoints[0] = {
        spaceBetween: 24,
        slidesPerView: 1,
        slidesPerGroup: 1
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

    return (
        <WidgetWrapper model={model} styles={styles} className= "small-margin-bottom-2 small-margin-top-1 medium-padding-bottom-1 medium-margin-bottom-2 medium-margin-top-2 large-padding-bottom-2 large-margin-bottom-3 large-margin-top-3">
            <h3>{model.content.title}</h3>
            <Swiper
                className={styles.nodeSwiper}
                modules={[Navigation]}
                slidesPerView={widgetData.slidesVisibleOnLargeScreens}
                breakpoints={breakpoints}
                onSwiper={initSwiper}
            >
                {widgetData?.images?.map((item, i)=> (
                    <SwiperSlide key={'slide-' + item.name + i}>
                        {GetCroppedImage(item, 'thumbnail')}
                    </SwiperSlide>
                ))}
                
                {navigationNextRef && navigationPrevRef && (

                    <>
                        <div className={styles.swiperprev} ref={navigationPrevRef}>
                            <i className="bmg-icon bmg-icon-chevron-left" />
                        </div>
                        <div className={styles.swipernext} ref={navigationNextRef}>
                            <i className="bmg-icon bmg-icon-chevron-right" />
                        </div>
                    </>
                )}
            </Swiper>
        </WidgetWrapper>
    )
}