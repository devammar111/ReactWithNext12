import { CommonData } from "./commonData.type"
import { UmbracoNode } from "./umbracoNode.type"

export type PageData = {
    preview: boolean,
    page: UmbracoNode,
    commonData: CommonData,
    modals: UmbracoNode[]
}

export type CheckOutProduct = {
    Name: boolean,
    Price: UmbracoNode,
    Quantity: CommonData,
}