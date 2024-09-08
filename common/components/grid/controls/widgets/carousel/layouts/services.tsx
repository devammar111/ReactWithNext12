import CarouselServiceModel from "../../../../../../../lib/umbraco/types/carouselServiceModel";
import { FlexibleLinkModel } from "../../../../../../../lib/umbraco/types/flexibleLinkModel.type";
import { ImageModel } from "../../../../../../../lib/umbraco/types/imageModel.type";
import { WidgetModel } from "../../../../../../../lib/umbraco/types/widgetModel.type";
import { getCropUrl } from "../../../../../../../lib/umbraco/util/helpers";
import ZoomSlides from "../../../../../zoomSlides/zoomSlides";
import Image from 'next/image';
import styles from "./services.module.scss";
import CircleLink from "../../../../../links/circleLink";
import { useEffect, useRef } from "react";
import { ScrollTrigger, gsap } from "@lib/greensock/all";
import ZoomSlidesNext from "../../../../../zoomSlides/zoomSlidesNext";
import WidgetWrapper from "../../widgetWrapper";
import variables from '@styles/variables.module.scss';

export type ServicesModel = {
    title: string,
    background: ImageModel,
    services: CarouselServiceModel[],
    nextLabel: string,
    followUpLink: FlexibleLinkModel,
    animateReveal: boolean
}

export default function Services(model: WidgetModel) {
    const ref = useRef<HTMLDivElement>(null);
    const data = model.content as ServicesModel;
    const background = {
        backgroundImage: `url('${getCropUrl(data.background, 'background')}')`
    };

    useEffect(() => {
        const element = ref.current;
        if (element) {
            const h2 = element.querySelector('h2');
            if (h2) {
                const slidesContainer = element.querySelector('.slidesContainer');
                const linkContainer = element.querySelector('.linkContainer');
                const elementRect = element.getBoundingClientRect();
                const h2Rect = h2.getBoundingClientRect();
                const start = (elementRect.top + elementRect.height / 2) - (h2Rect.top + h2Rect.height / 2);
                ScrollTrigger.matchMedia({
                    "(min-width: 1200px)": () => {
                        const tl = gsap.timeline({
                            scrollTrigger: {
                                trigger: element,
                                pin: true,
                                pinSpacing: true,
                                scrub: true,
                                start: 'top ' + variables.largeHeaderHeight + 'px',
                                snap: 1,
                                end: '+=' + elementRect.height * 1.5
                            }
                        })
                            .addLabel('start')
                            .set(h2, { y: start })
                            .fromTo(element, { clipPath: 'inset(12% 20%)' }, { clipPath: 'inset(0% 0%)', duration: .5 })
                            .to(h2, { y: 0, duration: .5 }, 'start')
                            .fromTo(slidesContainer, { autoAlpha: 0, y: 100 }, { autoAlpha: 1, y: 0, duration: .5 }, '-=.3')
                            .fromTo(linkContainer, { autoAlpha: 0, y: 100 }, { autoAlpha: 1, y: 0, duration: .5 }, '-=.3')
                    }
                })
            }
        }
    }, [])

    return (
        <WidgetWrapper model={model} styles={styles} className="small-padding-bottom-1 small-padding-top-1 medium-padding-bottom-2 medium-padding-top-2 darkBackground fullHeight" style={background} ref={ref}>
            <div className={styles.content}>
                <h2 className={styles.h1 + ' h1 small-margin-bottom-1 medium-margin-bottom-2'}>{data.title}</h2>
                <div className="slidesContainer">
                    <ZoomSlides left={
                        data.services.map(item =>
                            <Image key={item.image.id} className={styles.img} src={getCropUrl(item.image, 'thumbnail')} width={560} height={430} alt={item.image.name} layout="responsive" />
                        )
                    } right={
                        data.services.map((item, index) => (
                            <div key={item.image.id} className={styles.flexBox}>
                                <div>
                                    <h2 className={styles.serviceTitle}><span className="emphasize">{item.title}</span></h2>
                                    <p className={styles.serviceText + " small-margin-bottom-1"}>{item.text}</p>
                                    {!!item.link &&
                                        <CircleLink link={item.link} />
                                    }
                                </div>
                                <div className={styles.boxNext}>
                                    <h5 className={styles.serviceNextLabel}>{data.nextLabel}</h5>
                                    <h3 className="noMargin"><ZoomSlidesNext className={styles.next}><span className="emphasize">{data.services[(index + 1) % data.services.length].title}</span></ZoomSlidesNext></h3>
                                </div>
                            </div>
                        ))
                    } />
                </div>
                <div className={styles.linkContainer + ' linkContainer small-margin-top-1 medium-margin-top-2'}>
                    <CircleLink link={data.followUpLink} stacked={true} />
                </div>
            </div>
        </WidgetWrapper>
    )
}