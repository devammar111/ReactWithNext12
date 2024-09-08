import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Swiper as SwiperRef  } from "swiper";
import WidgetWrapper from "../../widgetWrapper";
import { WidgetModel } from '@lib/umbraco/types/widgetModel.type';
import { CarouselModel } from '../carousel';
import variables from "@styles/variables.module.scss";
import styles from './villagesCarousel.module.scss';
import { useRef } from 'react';
import { GetCroppedImage, getCropUrl } from '@lib/umbraco/util/helpers';
import CarouselServiceModel from '@lib/umbraco/types/carouselServiceModel';
import { ImageModel } from '@lib/umbraco/types/imageModel.type';
import Rte from '../../../rte';
import Image from "next/image";


export type VillagesCarouselModel = {
    customTitle: string,
    background: ImageModel,
    services: CarouselServiceModel[],
    footerImage: ImageModel,
    footerLink: string,
}
export default function VillagesCarousel(model: WidgetModel) {
    const widgetData = model.content as CarouselModel;
    const data = model.content as VillagesCarouselModel;
    const medium = parseInt(variables.breakpointMedium);
    const large = parseInt(variables.breakpointLarge);
    const navigationPrevRef = useRef<HTMLDivElement>(null);
    const navigationNextRef = useRef<HTMLDivElement>(null);
    const background = {
        backgroundImage: `url('${getCropUrl(data.background, 'village')}')`
    };
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
        <WidgetWrapper model={model} styles={styles} style={background}>
            <div className={styles.villageTitle + ' row'}>
                <div className="columns large-12 small-centered"> <Rte text={data.customTitle} /></div>
            </div>
            <Swiper
                className={styles.nodeSwiper}
                modules={[Navigation]}
                slidesPerView={widgetData.slidesVisibleOnLargeScreens}
                breakpoints={breakpoints}
                onSwiper={initSwiper}
            >
                {data?.services?.map((item, i) => (
                    <SwiperSlide className={styles.swiperSlide} key={'slide-' + i}>
                        {GetCroppedImage(item.image, 'village')}
                        <div className={styles.chevronUp }>
                            <i className="bmg-icon bmg-icon-chevron-up" />
                        </div>
                        <h5 className={styles.carouselHeading}>{item.title}</h5>
                        <p>{item.text}</p>
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
            <div className={styles.villageMap + ' row'}>
                <div className={"columns small-12 medium-5 large-3 small-centered " + styles.imageDiv}>
                    <Image src={getCropUrl(data.footerImage, "villageMap")} width={data.footerImage.width} height={data.footerImage.height} alt={data.footerImage.name} />
                </div>
                <div className="columns small-12 medium-5 large-3 small-centered">
                    <Rte text={data.footerLink} />
                </div>
            </div>
        </WidgetWrapper>
    )
}