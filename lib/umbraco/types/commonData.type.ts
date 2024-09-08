import { FlexibleLinkModel } from "./flexibleLinkModel.type";
import { Hours } from "./hours.type";
import { IconLinkModel } from "./iconLinkModel.type";
import { ImageModel } from "./imageModel.type";
import { LinkWithChildren } from "./linkWithChildren.type";

export type CommonData = {
    logo: ImageModel,
    secondaryLinks: FlexibleLinkModel[],
    socialLinks: IconLinkModel[],
    additionalLinks: IconLinkModel[],
    mainLinks: LinkWithChildren[],
    buttonLink: FlexibleLinkModel,
    verticalLink: FlexibleLinkModel,
    verticalLinkIcon: string,
    contactInfo: string,
    hours: Hours[],
    newsletterPrompt: string,
    newsletterModal: string,
    emphasizedLinks: FlexibleLinkModel[],
    footerLinks: LinkWithChildren[],
    copyright: string,
    dictionaries: NodeJS.Dict<string>,
    bottomLinks: FlexibleLinkModel[]
};