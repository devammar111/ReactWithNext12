import { WidgetModel } from "@lib/umbraco/types/widgetModel.type"
import GoogleMap from "./layouts/googleMap"
import AdvancedMap from "./layouts/AdvancedMap"

export default function Map(model: WidgetModel) {
    switch (model.layout) {
        case "Standard":
            return <GoogleMap {...model} />
        case "AdvancedMap":
            return <AdvancedMap {...model} />
        default:
            return null
    }
}