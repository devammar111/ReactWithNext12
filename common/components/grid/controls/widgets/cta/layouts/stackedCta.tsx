import Rte from "@components/grid/controls/rte";
import CircleLink from "@components/links/circleLink";
import { FlexibleLinkModel } from "@lib/umbraco/types/flexibleLinkModel.type";
import { ImageModel } from "@lib/umbraco/types/imageModel.type";
import { WidgetModel } from "@lib/umbraco/types/widgetModel.type";
import { GetCroppedImage } from "@lib/umbraco/util/helpers";
import WidgetWrapper from "../../widgetWrapper";
import styles from './stackedCta.module.scss';

export type StackedCtaModel = {
    image: ImageModel,
    text: string,
    link: FlexibleLinkModel
}

export default function StackedCta(model: WidgetModel) {
    const data = model.content as StackedCtaModel;
    return (
        <WidgetWrapper model={model} styles={styles}>
            <div className="small-margin-bottom-1 medium-margin-bottom-2">
                {GetCroppedImage(data.image, 'thumbnail')}
            </div>
            <Rte className="small-margin-bottom-1 medium-margin-bottom-2" text={data.text} />
            <CircleLink link={data.link} />
        </WidgetWrapper>
    )
}