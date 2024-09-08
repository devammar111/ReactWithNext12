import ImageLinkModel from "../../../lib/umbraco/types/imageLinkModel.type"
import { getCropUrl, getMediaDimensions } from "../../../lib/umbraco/util/helpers"
import FlexibleLink from "./flexibleLink";
import Image from "next/image";
import styles from "./imageLink.module.scss";

export type ImageLinkData = {
    link: ImageLinkModel,
    crop: string
}

export default function ImageLink({ link, crop }: ImageLinkData) {
    const dimensions = getMediaDimensions(link.background, crop);
    return (
        <FlexibleLink className={styles.imageLink} link={link.link}>
            <Image src={getCropUrl(link.background, crop)} width={dimensions?.width} height={dimensions?.height} layout="responsive" alt={link.background.name} />
            <span className={styles.title}>{link.link.label}</span>
        </FlexibleLink>
    )
}