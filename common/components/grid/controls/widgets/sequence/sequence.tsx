import CircleLink from "@components/links/circleLink";
import IconLink from "@components/links/iconLink";
import gsap from "@lib/greensock/gsap-core";
import ScrollTrigger from "@lib/greensock/ScrollTrigger";
import { IconLinkModel } from "@lib/umbraco/types/iconLinkModel.type";
import SequenceItem from "@lib/umbraco/types/sequenceItem.type";
import { WidgetModel } from "@lib/umbraco/types/widgetModel.type";
import { GetCroppedImage } from "@lib/umbraco/util/helpers";
import { ReactNode, useEffect, useRef } from "react";
import Rte from "../../rte";
import WidgetWrapper from "../widgetWrapper";

import variables from "@styles/variables.module.scss";
import styles from "./sequence.module.scss";

export type SequenceModel = {
    items: SequenceItem[],
    endingText?: string,
    links?: IconLinkModel[]
}

export default function Sequence(model: WidgetModel) {
    var {items, endingText, links} = model.content as SequenceModel;
    var hasLinks = links && links.length > 0;
    const animated = useRef(false);
    const ref = useRef<HTMLUListElement>(null);
    const ending = useRef<HTMLDivElement>(null);

    const _buildAnimation = (images: NodeListOf<HTMLImageElement>, titles: NodeListOf<Element>, text: NodeListOf<Element>, markers: NodeListOf<Element>, ending: HTMLDivElement | null, alternate: boolean) => {
        return () => {
            const dist = alternate ? 72 : -16;
            images.forEach((image, i) => {
                gsap.timeline({
                    scrollTrigger: {
                        trigger: markers[i],
                        start: 'bottom 100%',
                        end: '+=100'
                    }
                })
                    .fromTo(markers[i], { autoAlpha: 0, scale: .2}, {autoAlpha:1, scale: 1, duration: .3})
                    .fromTo([images[i], titles[i], text[i]], {autoAlpha: 0, x: alternate ? (i % 2 === 0 ? -dist : dist) : dist}, { autoAlpha: 1, x: 0, duration: .3});
            });
            
            if (ending) {
                gsap.timeline({
                    scrollTrigger: {
                        trigger: ending,
                        start: 'top 80%',
                        end: '+=100'
                    }
                })
                    .fromTo(ending, {autoAlpha: 0, y: 100}, {autoAlpha: 1, y: 0, duration: .3});
            }
        }
    }

    useEffect(() => {
        const element = ref.current;
        if (element && !animated.current) {
            const images = ref.current.querySelectorAll('img');
            const titles = ref.current.querySelectorAll('.title');
            const text = ref.current.querySelectorAll('.rte');
            const markers = ref.current.querySelectorAll('.marker');
            var small = "screen and (max-width:" + (parseInt(variables.breakpointMedium) - 1) + 'px)';
            var medium = "screen and (min-width:" + variables.breakpointMedium + ")";
            var settings : NodeJS.Dict<() => void> = {};
            settings[small] = _buildAnimation(images, titles, text, markers, ending.current, false);
            settings[medium] = _buildAnimation(images, titles, text, markers, ending.current, true);
            ScrollTrigger.matchMedia(settings);
        }
    }, [])

    return (
        <WidgetWrapper model={model} styles={styles}>
            <ul className={styles.items + " no-bullet"} ref={ref}>
                {items.map((item, i) => 
                    <li key={item.title}>
                        <div className={styles.wrapper}>
                            {GetCroppedImage(item.image, 'thumbnail')}
                            <div className={styles.markerContainer}>
                                <div className={styles.marker + ' marker'}></div>
                                {i === 0 &&
                                    <div className={styles.line}></div>
                                }
                            </div>
                            <h3 className={styles.title + ' title'}>{item.title}</h3>
                            <Rte className={styles.itemText} text={item.description} />
                        </div>
                    </li>    
                )}
            </ul>
            { (hasLinks || endingText) &&
                <div className={styles.ending} ref={ending}>
                    {endingText &&
                        <Rte className={styles.endingText} text={endingText} />
                    }
                    {hasLinks && 
                        <div className={styles.links}>
                            {links?.map(link => 
                                <div key={link.link.label}>
                                    <IconLink className="circleLink customIcon" link={link} />
                                </div>
                            )}
                        </div>
                    }
                </div>
            }
        </WidgetWrapper>
    )
}