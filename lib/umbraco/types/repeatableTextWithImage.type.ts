import { FlexibleLinkModel } from "./flexibleLinkModel.type";
import { ImageModel } from "./imageModel.type";

type RepeatableTextWithImage = {
    text: string,
    image: ImageModel,
    link?: FlexibleLinkModel,
}

export default RepeatableTextWithImage;