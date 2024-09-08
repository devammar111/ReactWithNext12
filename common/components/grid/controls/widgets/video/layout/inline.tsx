import { VideoModel } from "@lib/umbraco/types/videoModel.type"
import { WidgetModel } from "@lib/umbraco/types/widgetModel.type"
import WidgetWrapper from "../../widgetWrapper"

export type VideoWidgetModel = {
    video: VideoModel,
    usePageVideo: boolean
}

export default function Video(model : WidgetModel) {
    var data = model.content as VideoWidgetModel;
    return (
        <WidgetWrapper model={model}>
            <h3>Not implemented.</h3>
        </WidgetWrapper>
    )
}