import { getCropUrl } from "@lib/umbraco/util/helpers";
import Image from "next/image";
import styles from "./featuredTile.module.scss";
import Link from "next/link";
import { UmbracoNode } from "@lib/umbraco/types/umbracoNode.type";

export type featuredTileModel = {
    content: UmbracoNode,
    featuredItemLabel?: string
}

export default function FeaturedTile({ content, featuredItemLabel }: featuredTileModel) {
    return (
        <>
            <Link href={content.url}>
                <a className={styles.featuredTile}>
                    <Image className={styles.img} src={getCropUrl(content.image, 'thumbnail')} width={420} height={296} layout="responsive" alt={content.image.name} />
                    <div className={styles.text}>
                        <h6>FEATURED</h6>
                        <h6>{content.name}</h6>
                    </div>
                </a>
            </Link>
            {featuredItemLabel &&
                <div className={styles.featuredItemLabel}>{featuredItemLabel}</div>
            }
        </>
    )
}