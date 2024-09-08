import { UmbracoNode } from "../../../../../../lib/umbraco/types/umbracoNode.type";
import { WidgetModel } from "../../../../../../lib/umbraco/types/widgetModel.type";
import WidgetWrapper from "../widgetWrapper";
import styles from './productsByCategory.module.scss';
import CircularProgress from '@mui/material/CircularProgress';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useRef } from "react";
import { Swiper as SwiperRef } from "swiper";
import variables from "@styles/variables.module.scss";
import { Navigation } from "swiper";
import Link from "next/link";
import 'swiper/css';
import 'swiper/css/navigation';
import Image from "next/image";
import { ImageModel } from "@lib/umbraco/types/imageModel.type";
import CategoryTile from "@components/nodeTile/tiles/categoryTile";

export type ProductsByCategoryModel = {
    maxSlides?: number,
    slidesVisibleOnSmallScreens?: number,
    slidesVisibleOnMediumScreens?: number,
    slidesVisibleOnLargeScreens?: number,
    sources?: UmbracoNode[],
    categories: any,
    categoryOverrides: any

}


export type Category = {
    name: string,
    id: string,
    segment: string,
    url: string
}
export type CategoryOverrideItem = {
    name: string,
    id: string,
    segment: string
    image: ImageModel,
    url: string,
    title?: string
}
export type CategoryOverride = {
    category: Category,
    items: CategoryOverrideItem[]
}

export default function ProductsByCategory(model: WidgetModel) {

    var productsCarouselData = model.content as ProductsByCategoryModel;

    const navigationPrevRef = useRef<HTMLDivElement>(null);
    const navigationNextRef = useRef<HTMLDivElement>(null);

    const medium = parseInt(variables.breakpointMedium);
    const large = parseInt(variables.breakpointLarge);

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
        slidesPerView: 3,
        slidesPerGroup: 3
    };
    breakpoints[medium] = {
        spaceBetween: 50,
        slidesPerView: 3,
        slidesPerGroup: 3
    };
    breakpoints[large] = {
        spaceBetween: 56,
        slidesPerView: 3,
        slidesPerGroup: 3
    };

    const ScrollToCategory = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        if (typeof window !== 'undefined' && typeof document !== 'undefined') {
            var categorySection = document.getElementById(id);
            if (categorySection) {
                categorySection.scrollIntoView({ behavior: 'instant' as ScrollBehavior });
            }
        }
    }



    return (
        <WidgetWrapper className={styles.nodeCarousel} model={model} styles={styles}>
            <div className={styles.linkBarContainer}>
                <div className="grid-container">
                    <div className={styles.rectangleButtonWrapper}>
                        {productsCarouselData && productsCarouselData.categories && productsCarouselData.categories.length > 0 ?
                            productsCarouselData.categories.map((category: Category, index: number) => {
                                return (
                                    <a
                                        onClick={(e) => ScrollToCategory(e, category.id)}
                                        rel="noopener"
                                        key={category.id}
                                        className={styles.rectangleButton}
                                    >
                                        {category.name}
                                    </a>
                                )
                            })
                            :
                            <CircularProgress />

                        }
                    </div>
                </div>
            </div>


            <div className="grid-container">
                {
                    productsCarouselData && productsCarouselData.categoryOverrides && productsCarouselData.categoryOverrides.length > 0 ?
                        productsCarouselData.categoryOverrides.map((item: CategoryOverride, index: number) => {
                            return (
                                <div key={item.category.id} className="small-padding-top-2 small-padding-bottom-1 medium-padding-top-2 medium-padding-bottom-1 large-padding-top-3 large-padding-bottom-1">
                                    <h3>{item && item.category.name}</h3>
                                    <div id={item.category.id}>

                                        <Swiper
                                            className={styles.nodeSwiper}
                                            modules={[Navigation]}
                                            slidesPerView={3}
                                            breakpoints={breakpoints}
                                            onSwiper={initSwiper}
                                        >

                                            {item.items.map((categoryOverride: CategoryOverrideItem, index: number) => (
                                                <SwiperSlide key={'slide-' + categoryOverride.id}>
                                                    <CategoryTile content={categoryOverride} />
                                                    
                                                </SwiperSlide>
                                            ))}


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


                                        <div className={styles.viewAllContainer}>
                                            <div className={styles.chevronContainer}>
                                                <i className="bmg-icon bmg-icon-chevron-right" />
                                            </div>
                                            <div className={styles.viewAll}>
                                                <div className={styles.category}>{item.category.name}</div>
                                                <Link href={item.category.url} className={styles.view}>View All</Link>
                                            </div>
                                        </div>



                                    </div>
                                </div>
                            )
                        })

                        : <CircularProgress />
                }
            </div >
        </WidgetWrapper >

    )
}