import Rte from '@components/grid/controls/rte';
import { FlexibleLinkModel } from '@lib/umbraco/types/flexibleLinkModel.type';
import { ImageModel } from '@lib/umbraco/types/imageModel.type';
import { WidgetModel } from '@lib/umbraco/types/widgetModel.type';
import { getAbsoluteMediaUrl, getCropUrl } from '@lib/umbraco/util/helpers';
import WidgetWrapper from '../../widgetWrapper';
import Image from 'next/image';
import styles from './sideImageCta.module.scss';
import CircleLink from '@components/links/circleLink';

export type SideImageCtaModel = {
    background: ImageModel,
    text: string,
    link: FlexibleLinkModel,
    secondaryImage: ImageModel,
    secondaryImageWidth: number,
    secondaryImageAlignment: string,
    secondaryImageOffsetX: number,
    secondaryImageOffsetY: number
}

export default function SideImageCta(model: WidgetModel) {
    const data = model.content as SideImageCtaModel;
    let offset: NodeJS.Dict<any> = {};
    let alignmentClasses = '';
    if (data.secondaryImage) {
        offset = Object.assign(offset, {
            width: data.secondaryImage.width + 'px',
            height: data.secondaryImage.height + 'px'
        });
        if (data.secondaryImageAlignment) {
            alignmentClasses = 'posBottomLeft';
            const alignment = data.secondaryImageAlignment?.split(' ');
            if (alignment.length) {
                const horizontalVal = alignment[0];
                const verticalVal = alignment[1];
                const horizontalPos = horizontalVal.charAt(0).toUpperCase() + horizontalVal.slice(1);
                const verticalPos = verticalVal.charAt(0).toUpperCase() + verticalVal.slice(1);
                alignmentClasses = `pos${verticalPos}${horizontalPos}`;
            }
        }
        if (data.secondaryImageOffsetX != 0) {
            offset.left = (-80 + data.secondaryImageOffsetX) + 'px';
            delete offset.right;
            alignmentClasses = '';
        }
        if (data.secondaryImageOffsetY != 0) {
            offset.top = (-12 + data.secondaryImageOffsetY) + 'px';
            delete offset.bottom;
            alignmentClasses = '';
        }
        if (data.secondaryImageWidth > 0) {
            offset.width = data.secondaryImageWidth + 'px';
            offset.height = `${data.secondaryImage.height * (data.secondaryImageWidth / data.secondaryImage.width)}px`;
        }
    }


    return (
        <WidgetWrapper model={model} styles={styles}>
            <div className="grid-container">
                <div className={"grid-x "+styles.container}>
                    <div className={styles.leftPanel + " cell small-12 medium-12 large-5 small-padding-bottom-2 small-padding-top-2 large-padding-bottom-3 large-padding-top-3"}>
                        <div className={styles.contentSec}>
                            <Rte text={data.text} className="small-margin-bottom-1" />
                            <CircleLink link={data.link} />
                        </div>
                    </div>
                    {data.secondaryImage &&
                        <div className={styles.rightPanel + " cell small-12 medium-12 large-7"}>
                            <div className={styles.image + ' ' + styles[alignmentClasses]} style={offset}>
                                <Image src={getAbsoluteMediaUrl(data.secondaryImage.url)} width={offset.width} height={offset.height} alt={data.secondaryImage.name} />
                            </div>
                        </div>
                    }
                </div>
            </div>
        </WidgetWrapper>
    )
}