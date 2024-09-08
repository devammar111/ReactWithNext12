import { WidgetModel } from "@lib/umbraco/types/widgetModel.type";
import WidgetWrapper from "../widgetWrapper";
import { text } from "stream/consumers";
import Rte from "../../rte";
import styles from './TextWithBackground.module.scss';
import { getAlteredImageUrl } from "@lib/umbraco/util/helpers";
export default function TextWithBackground(model: WidgetModel) {
    var Modal = model.content;
    const backgroundStyles = {
        backgroundImage: `url('${getAlteredImageUrl(Modal.backgroundImage, { width: 1920 })}')`,

    };
    return (
        <WidgetWrapper model={model} styles={styles}>
             <div style={backgroundStyles} className={styles.backgroundImage}>
             <div className={styles.anhcSec}>
                <Rte text={Modal.text} />
                </div>
            </div>
        </WidgetWrapper>
    )
}