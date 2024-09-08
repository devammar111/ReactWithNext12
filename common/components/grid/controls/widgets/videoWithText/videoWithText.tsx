import { WidgetModel } from "@lib/umbraco/types/widgetModel.type"
import Videos from "./layout/videos"

export default function Carousel(model: WidgetModel) {
    switch (model.variant) {
        default:
            return <Videos {...model} />
    }
}