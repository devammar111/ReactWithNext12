import { WidgetModel } from "../../../../../../lib/umbraco/types/widgetModel.type"
import FullWidthCta from "./layouts/fullWidthCta"
import StackedCta from "./layouts/stackedCta"
import TileCta from "./layouts/tileCta"
import SideImageCta from "./layouts/sideImageCta";
import SideVideoCta from "./layouts/sideVideoCta";

export default function Carousel(model: WidgetModel) {
    switch (model.variant) {
        case "FullWidth":
            return <FullWidthCta {...model} />
        case "Tile":
            return <TileCta {...model} />
        case "Stacked":
            return <StackedCta {...model} />
        case "SideImage":
            return <SideImageCta {...model} />
        case "SideVideo":
            return <SideVideoCta {...model} />
        default:
            return null
    }
}