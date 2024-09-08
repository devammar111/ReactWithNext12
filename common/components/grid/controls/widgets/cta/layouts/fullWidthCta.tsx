import { FlexibleLinkModel } from "../../../../../../../lib/umbraco/types/flexibleLinkModel.type";
import { ImageModel } from "../../../../../../../lib/umbraco/types/imageModel.type";
import { WidgetModel } from "../../../../../../../lib/umbraco/types/widgetModel.type";
import { getCropUrl } from "../../../../../../../lib/umbraco/util/helpers";
import styles from "./fullWidthCta.module.scss";
import WidgetWrapper from "../../widgetWrapper";
import OverlayTile from "@components/overlayTile/overlayTile";
import { VideoModel } from "@lib/umbraco/types/videoModel.type";

export type FullWidthCtaModel = {
    background: ImageModel,
    text: string,
    link: FlexibleLinkModel,
    video: VideoModel,
    videoPrompt: string,
    secondaryImage: ImageModel,
    secondaryImageWidth: number,
    secondaryImageOffsetX: number,
    secondaryImageOffsetY: number,
    linkIcon: string
    backgrountGradientMask: string,
    removeTextBackground: boolean, 
    extraImageSpace: boolean,

}

export default function TileCta(model: WidgetModel) {
    const data = model.content as FullWidthCtaModel;
    let wrapperLeft700 = '';
    let wrapperRight700 = '';
    let extraImageSpaceClass = '';
    let removeTextBackgroundClass = '';
    let overlayBannerClass = '';
    let background = {};

    if (data.removeTextBackground) {
        removeTextBackgroundClass = ' ' + styles.removeTextBackground;
        let gradient90Degree = 'linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,0,0,0) 50%)';
        let gradient290Degree = 'linear-gradient(to left, rgba(0,0,0,1), rgba(0,0,0,0) 60%)';
        if (model.layout == "LeftAligned") {
            background = {
                backgroundImage: `${gradient90Degree},url('${getCropUrl(data.background, 'mediumBackground')}')`,
                minHeight: `700px`
            };
            wrapperLeft700 = ' ' + styles.wrapperLeft700;
        }
        else {
            background = {
                backgroundImage: `${gradient290Degree}, url('${getCropUrl(data.background, 'mediumBackground')}')`,
                minHeight: `700px`
            };
            wrapperRight700 = ' ' + styles.wrapperRight700;
            
        }
       
    }
    else {
        
        if (data.extraImageSpace) {
            extraImageSpaceClass = ' ' + styles.extraImageSpace;

        }
        background = {
            backgroundImage: `url('${getCropUrl(data.background, 'fullBackground')}')`,
            minHeight: `900px`
        };
        overlayBannerClass = styles.overlayBanner;

    }


    return (
        <WidgetWrapper className="fullHeight" model={model} styles={styles} style={background}>
            <div className={styles.wrapper + wrapperRight700 + wrapperLeft700}>
                <OverlayTile className={overlayBannerClass + removeTextBackgroundClass + extraImageSpaceClass}
                    image={data.secondaryImage} text={data.text} link={data.link}
                    video={data.video} videoPrompt={data.videoPrompt} linkIcon={data.linkIcon}
                    secondaryImageWidth={data.secondaryImageWidth} secondaryImageOffsetX={data.secondaryImageOffsetX}
                    secondaryImageOffsetY={data.secondaryImageOffsetY}/>
            </div>
        </WidgetWrapper>
    )
}