import { FlexibleLinkModel } from "./flexibleLinkModel.type";
import { GeocodedLocation } from "./geocodedLocation.type";
import { ImageModel } from "./imageModel.type";

export type locations = {
    name: string,
    id: number,
    key: string,
    url: string,
    urlSegment: string,
    contentTypeAlias: string,
    createDate: Date,
    updateDate: Date
    properties: property
}
export type property= {
    address: GeocodedLocation,
    categories: category[],
    website: string,
    phoneNumber: string,
    tribes?: category[],
    createDate: Date,
}
export type category = {
    id: number,
    icon: string,
    key: string,
    name: string,
    udi: string,
}
export default locations;