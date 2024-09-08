export type UmbracoNode = {
    name: string,
    id: number,
    key: string,
    url: string,
    urlSegment: string,
    segment: string,
    contentTypeAlias: string,
    createDate: Date,
    updateDate: Date,
    properties: any,
    categoryId?: string,
    image?: any,
    rootPath?: string
}