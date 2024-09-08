import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Swiper as SwiperRef  } from "swiper";
import WidgetWrapper from "../../widgetWrapper";
import { WidgetModel } from '@lib/umbraco/types/widgetModel.type';
import { CarouselModel } from '../carousel';
import variables from "@styles/variables.module.scss";
import { GetCroppedImage } from '@lib/umbraco/util/helpers';
import styles from './imageTextCarousel.module.scss';
import { NavigationOptions } from 'swiper/types';
import { useState } from 'react';
import { Pagination } from 'swiper';
export default function ImageTextCarousel(model: WidgetModel) {
    
    var data = model.content.carouselWithText;
    const [swiper, setSwiper] = useState<SwiperRef | null>(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    const medium = parseInt(variables.breakpointMedium);
    const large = parseInt(variables.breakpointLarge);
    const breakpoints : { [key: number] : any} = {};
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

    const navSettings : NavigationOptions = {
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

        <WidgetWrapper model={model} styles={styles} className={styles.press_Releases + " image-text-slider"}  >
            <h3><strong>Press Releases</strong></h3>
            {data ? ( // Check if data is available before rendering the Swiper

                

                    <Swiper
        slidesPerView={3}
                    spaceBetween={40}
                    loop={true}
                    pagination={{
                        clickable: true,
                    }}
                    navigation={true}
                    modules={[Pagination]}
                    className= {styles.mySwiper}
                >
                  
                

                    <div className={styles.imageCarousel}>
                        {data.map((image: any, index: any) => (
                            <SwiperSlide key={'slide-' + index}>
                                <div className={styles.imageCarousel}>
                                    {GetCroppedImage(image.images, 'thumbnail')}
                                </div>
                                <h6>{image.carouselText}</h6>
                            </SwiperSlide>
                        ))}
                    </div>
                    <a className={styles.prev + (isBeginning ? ' ' + styles.disabled : '')} onClick={prev}></a>
                    <a className={styles.next + (isEnd ? ' ' + styles.disabled : '')} onClick={next}></a>
                </Swiper>

            ) : null}
         
        </WidgetWrapper>

    )
}