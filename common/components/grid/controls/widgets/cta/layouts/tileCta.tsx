import { FlexibleLinkModel } from "../../../../../../../lib/umbraco/types/flexibleLinkModel.type";
import { ImageModel } from "../../../../../../../lib/umbraco/types/imageModel.type";
import { WidgetModel } from "../../../../../../../lib/umbraco/types/widgetModel.type";
import { getAbsoluteMediaUrl } from "../../../../../../../lib/umbraco/util/helpers";
import CircleLink from "../../../../../links/circleLink";
import Image from 'next/image';
import Rte from "../../../rte";
import styles from './tileCta.module.scss';
import WidgetWrapper from "../../widgetWrapper";

export type TileCtaModel = {
    background: ImageModel,
    text: string,
    link: FlexibleLinkModel,
    secondaryImage: ImageModel,
    secondaryImageWidth: number,
    secondaryImageOffsetX: number,
    secondaryImageOffsetY: number,
    backgroundColor: string
}

export default function TileCta(model: WidgetModel) {
    const data = model.content as TileCtaModel;
    let customOverlayContainerStyle={};
if(data.backgroundColor){
    customOverlayContainerStyle ={
        'background-color' : `#${data.backgroundColor}`,
   }
}
    const imageOffset = {
        right: -data.secondaryImageOffsetX + 'px',
        bottom: -data.secondaryImageOffsetY + 'px'
    }
    const linkWidthCap = {
        maxWidth: data.secondaryImage ? `calc(100% - ${data.secondaryImageWidth - data.secondaryImageOffsetX + 16}px)` : ';top:128px'
    }
    return (
        <WidgetWrapper model={model} styles={styles} style={customOverlayContainerStyle}>
            <Rte className={styles.rte} text={data.text} />
            <CircleLink link={data.link} style={linkWidthCap} />
            {data.secondaryImage &&
                <div className={styles.secondaryImage + ' hide-for-small-only'} style={imageOffset}>
                    <Image src={getAbsoluteMediaUrl(data.secondaryImage.url)} width={data.secondaryImageWidth} height={100} />
                </div>
            }
        </WidgetWrapper>
    )
}