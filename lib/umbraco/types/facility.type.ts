import { ImageModel } from "./imageModel.type";

export type facilityItem = {
    label: string,
    text: string,
    image: ImageModel,
    pointerOffsetX: number,
    pointerOffsetY: number,
    segment: string
}
export default facilityItem;