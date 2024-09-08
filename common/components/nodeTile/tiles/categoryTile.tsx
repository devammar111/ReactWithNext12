import { getCropUrl } from "@lib/umbraco/util/helpers";
import Image from "next/image";
import styles from "./categoryTile.module.scss";
import Link from "next/link";
import { NodeTileModel } from "../nodeTile";
import { CategoryOverrideItem } from "@components/grid/controls/widgets/productsByCategory/productsByCategory";


type CategoryTileProps = {
    content: CategoryOverrideItem
}

export default function CategoryTile({ content }: CategoryTileProps) {
    return (

        <Link href={content.url}>
            <a className={styles.newsTile}>
                <Image className={styles.img} src={getCropUrl(content.image, 'thumbnail')} width={420} height={300} layout="responsive" alt={content.name} />
                <div className={styles.text}>
                    <h6>{content.name || content.title}</h6>
                </div>
            </a>
        </Link>

    )
}