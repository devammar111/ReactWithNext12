import { FlexibleLinkModel } from "@lib/umbraco/types/flexibleLinkModel.type";
import { ImageModel } from "@lib/umbraco/types/imageModel.type";
import { UmbracoNode } from "@lib/umbraco/types/umbracoNode.type";
import { WidgetModel } from "../../../../../../lib/umbraco/types/widgetModel.type";
import ImageCarousel from "./layouts/imageCarousel";
import NodeCarousel from "./layouts/nodeCarousel";
import Services from "./layouts/services";
import VillagesCarousel from "./layouts/villagesCarousel";
import ProductCarousel from "./layouts/productCarousel";

export type CarouselModel = {
    title?: string,
    background?: ImageModel,
    images?: ImageModel[],
    items?: UmbracoNode[],
    services?: UmbracoNode[],
    nextLabel?: string,
    followUpLink: FlexibleLinkModel,
    sources?: UmbracoNode[],
    query?: string,
    allowedTypes?: string[],
    maxSlides?: number,
    slidesVisibleOnSmallScreens?: number,
    slidesVisibleOnMediumScreens?: number,
    slidesVisibleOnLargeScreens?: number,
    auto?: boolean,
    autoInterval?: number,
    footerImage?: ImageModel,
    footerLink?: string,

}

export default function Carousel(model: WidgetModel) {
    switch (model.layout) {
        case "Services":
            return <Services {...model} />
        default:
            if (model.variant === 'Images') {
                return <ImageCarousel {...model} />
            }
            if (model.variant === 'Villages') {
                return <VillagesCarousel {...model} />
            }
            if (model.variant === "Product") {
                return <ProductCarousel {...model} />
            }

            return <NodeCarousel {...model} />
    }
}