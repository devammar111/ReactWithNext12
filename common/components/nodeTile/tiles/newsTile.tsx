import { ImageModel } from "@lib/umbraco/types/imageModel.type";
import { UmbracoNode } from "@lib/umbraco/types/umbracoNode.type";
import { GetCroppedImage, getCropUrl } from "@lib/umbraco/util/helpers";
import Image from "next/image";
import styles from "./newsTile.module.scss";
import Link from "next/link";
import { NodeTileModel } from "../nodeTile";

export default function NewsTile({ content, viewDetailsPrompt }: NodeTileModel) {
    return (
        <Link href={content.url}>
            <a className={styles.newsTile}>
                <Image className={styles.img} src={getCropUrl(content.properties.image, 'thumbnail')} width={420} height={300} layout="responsive" alt={content.properties.image?.name} />
                <div className={styles.text}>
                    <h6>{content.name}</h6>
                    {!!viewDetailsPrompt &&
                        <p>{viewDetailsPrompt}</p>
                    }
                </div>
            </a>
        </Link>
    )
}