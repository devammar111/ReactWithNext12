import { getCropUrl } from "@lib/umbraco/util/helpers";
import styles from './productTile.module.scss';
import Link from "next/link";
import { NodeTileModel } from "../nodeTile";
import Image from "next/image";
export default function ProductTile({ content }: NodeTileModel) {
    return (
        <Link href={content.url} className={styles.product}>
            <a className={styles.productPanel}>
                <div className={styles.productImg}>
                    <Image className={styles.img} src={getCropUrl(content.image, 'thumbnail')} width={420} height={296} layout="responsive" alt={content.image.name} />
                </div>

                <div className={styles.productDetails}>
                    <h6>{content.name}</h6>
                </div>
            </a>
        </Link>
    )
}