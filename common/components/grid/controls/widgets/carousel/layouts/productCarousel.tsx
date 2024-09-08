import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Swiper as SwiperRef } from "swiper";
import WidgetWrapper from "../../widgetWrapper";
import { WidgetModel } from '@lib/umbraco/types/widgetModel.type';
import variables from "@styles/variables.module.scss";
import { GetCroppedImage, getCropUrl } from '@lib/umbraco/util/helpers';
import styles from './productCarousel.module.scss';
import { NavigationOptions } from 'swiper/types';
import { useRef, useState } from 'react';
import { Pagination } from 'swiper';
import Image from "next/image";
import Link from 'next/link';
import { Navigation } from "swiper";
import { CategoryOverrideItem } from '../../productsByCategory/productsByCategory';
import CategoryTile from '@components/nodeTile/tiles/categoryTile';




export default function ProductCarousel(model: WidgetModel) {

    var data = model.content.items;

    const [swiper, setSwiper] = useState<SwiperRef | null>(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    const navigationPrevRef = useRef<HTMLDivElement>(null);
    const navigationNextRef = useRef<HTMLDivElement>(null);

    const medium = parseInt(variables.breakpointMedium);
    const large = parseInt(variables.breakpointLarge);



    const breakpoints: { [key: number]: any } = {};
    breakpoints[0] = {
        spaceBetween: 16,
        slidesPerView: 1
    }
    breakpoints[medium] = {
        spaceBetween: 25,
        slidesPerView: 2
    };
    breakpoints[large] = {
        spaceBetween: 45,
        slidesPerView: 3
    };

    const navSettings: NavigationOptions = {
        prevEl: '.' + styles.prev,
        nextEl: '.' + styles.next
    }

    const initSwiper = (swiperInstance: SwiperRef) => {

        setSwiper(swiperInstance);
        setIsBeginning(swiperInstance.isBeginning);
        setIsEnd(swiperInstance.isEnd);
    }

    const prev = () => {
        if (swiper) {
            swiper.slidePrev();
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
        }
    }

    const next = () => {
        if (swiper) {
            swiper.slideNext();
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
        }
    }

    return (

        <WidgetWrapper model={model} styles={styles} className={styles.nodeCarousel}  >
           
            <div className='className="small-padding-top-2 small-padding-bottom-2 medium-padding-top-2 medium-padding-bottom-2 large-padding-top-3 large-padding-bottom-1"'>
            <h3>
                <strong>{model.content.title}</strong>
            </h3>
                <Swiper
                    className={styles.nodeSwiper}
                    modules={[Navigation]}
                    slidesPerView={3}
                    breakpoints={breakpoints}
                    onSwiper={initSwiper}
                >
                    {data ?
                        (
                            <div className={styles.imageCarousel}>
                                {data.map((item: any, index: any) => (
                                    <SwiperSlide key={'slide-' + item.id}>
                                        <CategoryTile content={item} />

                                    </SwiperSlide>
                                ))}
                            </div>
                        ) : null}

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
            </div>

        </WidgetWrapper>

    )
}