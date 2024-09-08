import { getCropUrl } from "@lib/umbraco/util/helpers";
import Image from "next/image";
import styles from "./featuredTile.module.scss";
import Link from "next/link";
import { Url } from "url";

export type featuredProductTileModel = {
    content: any,
    featuredItemLabel?: string,
    image?: any;
    url: string;
    categoryurl?: string
}

export default function FeaturedProductTile({ content, featuredItemLabel, image, url, categoryurl }: featuredProductTileModel) {
    return (
        <>
            <Link href={"/products/products/" + categoryurl + "/" + url}>
                <a className={styles.featuredTile}>
                    <img className={styles.img} src={image ? image.url : ""} width={420} height={296} alt={image ? image.name : ""} />
                    <div className={styles.text}>
                        <h6>FEATURED</h6>
                        <h6>{content.item_variation_data.name}</h6>
                    </div>
                </a>
            </Link>
            {featuredItemLabel &&
                <div className={styles.featuredItemLabel}>{featuredItemLabel}</div>
            }
        </>
    )
}