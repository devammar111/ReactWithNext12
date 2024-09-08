import { WidgetModel } from "@lib/umbraco/types/widgetModel.type";
import Rte from "../../rte";
import Image from "next/image";
import { getCropUrl } from "@lib/umbraco/util/helpers";
import styles from './RichTextPair.module.scss';
import { ImageModel } from "../../../../../../lib/umbraco/types/imageModel.type";
import WidgetWrapper from "../widgetWrapper";

export type RichTextPairModel = {
    backgroundImage: ImageModel,
    leftPanel: string,
    rightPanel: string,
}
export default function RichTextPair(model: WidgetModel) {
    let backgroundImageStyle: NodeJS.Dict<any> = {};
    let isDarkBackground = "";
    const layout = model.layout;
    let paddingClasses = '';

    const { backgroundImage, leftPanel, rightPanel } = model.content as RichTextPairModel;
    if (backgroundImage && backgroundImage != null) {
        backgroundImageStyle.backgroundImage = `url('${getCropUrl(backgroundImage, 'background')}')`;
        isDarkBackground += " darkBackground";
        if (layout === 'RoundedCorner') {
            backgroundImageStyle.borderRadius = '20px';
        }
        paddingClasses = "large-padding-top-3 medium-padding-bottom-2 medium-padding-top-2 small-padding-bottom-1 small-padding-top-1";
    }
    else {
        paddingClasses = "medium-padding-bottom-3 medium-padding-top-2 small-padding-bottom-1 small-padding-top-1";
    }

    return (
        <WidgetWrapper model={model} className={paddingClasses} styles={styles} style={backgroundImageStyle}>
            <div className={styles.container + " grid-container" + isDarkBackground}>
                <Rte text={leftPanel} className={styles.leftPanel} />
                <Rte text={rightPanel} className={styles.rightPanel} />
            </div>
        </WidgetWrapper>
    )
}