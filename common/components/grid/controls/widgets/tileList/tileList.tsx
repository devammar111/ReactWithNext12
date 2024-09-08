import ScrollTrigger from '@lib/greensock/ScrollTrigger';
import { ImageModel } from '@lib/umbraco/types/imageModel.type';
import RepeatableText from '@lib/umbraco/types/repeatableText.type';
import { WidgetModel } from '@lib/umbraco/types/widgetModel.type';
import { getCropUrl } from '@lib/umbraco/util/helpers';
import { useEffect, useRef } from 'react';
import WidgetWrapper from '../widgetWrapper';
import variables from '@styles/variables.module.scss';
import styles from './tileList.module.scss';
import gsap from '@lib/greensock/gsap-core';
import Rte from '../../rte';
import RepeatableTextWithImage from '@lib/umbraco/types/repeatableTextWithImage.type';
import OverlayTile from '../../../../overlayTile/overlayTile';
import useScreenWidth from 'common/util/useScreenWidth';

export type TileListModel = {
    background: ImageModel,
    title: string,
    items?: RepeatableText[],
    itemsWithImages?: RepeatableTextWithImage[],
    isNotAnimated: boolean,
}

export default function TileList(model: WidgetModel) {
    const ref = useRef<HTMLDivElement>(null);
    const data = model.content as TileListModel;
    let overlayImagePosition: number = -10
    let backgroundObj: NodeJS.Dict<any> = {};
    const { width } = useScreenWidth();
    let tileListClasses = '';
    if (model.layout === "ThreeColumn") {
        backgroundObj.backgroundImage = `url('${getCropUrl(data.background, 'fullBackground')}')`;
    }
    else {
        backgroundObj.backgroundImage = `url('${getCropUrl(data.background, 'background')}')`;
    }

    if (model.layout === "FourColumn") {
        tileListClasses = styles.layoutFourColumn;
    }
    else if (model.layout === "ThreeColumn") {
        tileListClasses = styles.layoutThreeColumn;
    }
    else {
        tileListClasses = "small-padding-bottom-1 small-padding-top-1 medium-padding-bottom-2 medium-padding-top-2 fullHeight";
    }
    if (width < 640) {
        overlayImagePosition = 16;
    }

    useEffect(() => {
        const element = ref.current;
        if (element && model.layout === "Animated") {
            const h2 = element.querySelector('h2');
            if (h2) {
                const tiles = element.querySelector('.grid-container');
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
                            .fromTo(tiles, { autoAlpha: 0, y: 100 }, { autoAlpha: 1, y: 0, duration: .5 }, '-=.3')
                    }
                })
            }
        }
    }, [])


    return (
        <WidgetWrapper model={model} styles={styles} className={tileListClasses} style={backgroundObj} ref={ref}>

            <div className={styles.content}>
                {
                    model.layout === "Animated"
                        ?
                        <h2 className={styles.h1 + ' h1 small-margin-bottom-1 medium-margin-bottom-2'}>{data.title}</h2>
                        : data.title ?
                            <h3 className={styles.h3 + ' small-margin-bottom-1 medium-margin-bottom-2 medium-margin-bottom-3'}>{data.title}</h3>
                            : undefined
                }
                <div className="grid-container">
                    <div className={styles.tiles}>
                        {
                            model.layout === "Animated" ? data.items?.map((item, index) =>
                                <Rte key={index} text={item.text} className={styles.tile} />
                            ) : data.itemsWithImages?.map((tile, index) =>

                                <div key={index} >
                                    <OverlayTile className={styles.tile + ' ' + styles.tileWithImage} image={tile.image}
                                        text={tile.text} link={tile.link} secondaryImageOffsetY={overlayImagePosition} />
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </WidgetWrapper>
    )
}