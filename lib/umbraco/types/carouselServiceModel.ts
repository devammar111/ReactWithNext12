import { ImageModel } from "./imageModel.type"
import { FlexibleLinkModel } from './flexibleLinkModel.type';

type CarouselServiceModel = {
    image: ImageModel,
    title: string,
    text: string,
    link?: FlexibleLinkModel
}

export default CarouselServiceModel