import { WidgetModel } from "@lib/umbraco/types/widgetModel.type";
import Rte from "../../rte";
import styles from './LinkOptions.module.scss'
import WidgetWrapper from "../widgetWrapper";
import CircleLink from "../../../../links/circleLink";
export default function LinkOptions(model: WidgetModel) {
    var Model = model.content;
    return (
        <WidgetWrapper model={model} styles={styles} >
            <div className={styles.videoPhotoUsage}>
                <div className={styles.videoPhotoSec}>
                    <Rte text={Model.title} />
                    <div className={styles.flexRow}>
                        <div className={styles.colLeft}>
                            <Rte text={Model.leftContent} />
                        </div>
                        
                        <div><span className={styles.moreOption}>{Model.contentBetween}</span></div>
                        <div className={styles.colRight}>
                            <Rte text={Model.rightContent} />
                        </div>
                    </div>
                    
                </div>
            </div>
        </WidgetWrapper>
    )
}