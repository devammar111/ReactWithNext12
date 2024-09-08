import { getCropUrl } from "@lib/umbraco/util/helpers";
import Image from "next/image";
import styles from "./imageTile.module.scss";
import Link from "next/link";
import { NodeTileModel } from "../nodeTile";

export default function NewsTile({content}: NodeTileModel) {
    return (
        <Link href={content.url}>
            <a className={styles.imageTile}>
                <Image className={styles.img} src={getCropUrl(content.properties.image, 'thumbnail')} width={420} height={296} layout="responsive" alt={content.properties.image.name } />
                <div className={styles.text}>
                    <h6>{content.name}</h6>
                </div>
            </a>
        </Link>
    )
}