import { FlexibleLinkModel } from "../../../../../../lib/umbraco/types/flexibleLinkModel.type"
import { WidgetModel } from "../../../../../../lib/umbraco/types/widgetModel.type";
import CircleLink from "../../../../links/circleLink"
import Rte from "../../rte";
import WidgetWrapper from "../widgetWrapper";
import styles from './linkBar.module.scss';
import FlexibleLink from "@components/links/flexibleLink";

export type LinkBarModel = {
    links: FlexibleLinkModel[],
    followUpText?: string
}
export default function LinkBar(model: WidgetModel) {
    var { links, followUpText } = model.content as LinkBarModel;

    const getLayout = () => {
        switch (model.layout) {
            case "RectangleButtons": {
                return (
                    <>
                        <div className={styles.rectangleButtonWrapper}>
                            {
                                links.map((link, index) =>
                                    <FlexibleLink key={"rectangleButton" + index} className={`${styles.rectangleButton}`} link={link} />
                                )
                            }
                        </div>
                    </>
                )
            }
            default: {
                return (
                    <>
                        <div className={`${styles.grid} grid-x grid-margin-x small-up-1 medium-up-2 large-up-4`}>
                            {
                                links.map((link, index) =>
                                    <div key={'linkBar-' + index} className={styles.cell + ' cell'}>
                                        <CircleLink link={link} />
                                    </div>
                                )
                            }
                        </div>
                    </>
                )
            }
        }
    }
    return (
        <WidgetWrapper className="small-padding-top-1 small-padding-bottom-1 medium-padding-top-2 medium-padding-bottom-2" model={model} styles={styles}>
            <div className="grid-container">
                {getLayout()}

                {!!followUpText &&
                    <div className="small-margin-top-1 medium-margin-top-2">
                        <Rte text={followUpText} className={styles.textHeading}  />
                    </div>
                }
            </div>
        </WidgetWrapper>
    )
}