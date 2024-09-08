import { UmbracoNode } from "@lib/umbraco/types/umbracoNode.type";
import { VideoModel } from "@lib/umbraco/types/videoModel.type";
import styles from './videoTile.module.scss';
import Image from 'next/image';
import Link from "@components/links/link";
import { FormatTimeWithHoursAndMinutes } from "@lib/umbraco/util/helpers";
export default function VideoTile(model: UmbracoNode) {
    const video = model.properties.videoData as VideoModel;
    return (
        <Link href={model.url}>
            <a className={styles.videoTile}>
                <div className={styles.imageWrapper}>
                    <Image src={video.thumbnailUrl} width={419} height={272} layout="responsive" alt={video.authorName} />
                </div>
                <div className={styles.text}>
                    <i className="bmg-icon bmg-icon-play"></i>
                    <div>
                        <h5 className="noMargin">{model.name}</h5>
                        {video.duration &&
                            <p className="noMargin">Duration: {FormatTimeWithHoursAndMinutes(video.duration)}</p>
                        }
                    </div>
                </div>
            </a>
        </Link>
    )
}