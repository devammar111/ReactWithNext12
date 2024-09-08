import { WidgetModel } from "@lib/umbraco/types/widgetModel.type"
import Inline from "./layout/inline"
import SideText from "./layout/sideText"

export default function Carousel(model: WidgetModel) {
    switch (model.variant) {
        case "SideText":
            return <SideText {...model} />
        default:
            return <Inline {...model} />
    }
}