import { FlexibleLinkModel } from "@lib/umbraco/types/flexibleLinkModel.type"
import { ImageModel } from "@lib/umbraco/types/imageModel.type";
import styles from "./overlayTile.module.scss";
import Image from "next/image";
import { getAbsoluteMediaUrl } from "@lib/umbraco/util/helpers";
import Rte from "@components/grid/controls/rte";
import CircleLink from "@components/links/circleLink";
import { VideoModel } from "@lib/umbraco/types/videoModel.type";
import VideoDialog from "@components/dialogs/videoDialog";
import DialogTrigger from "@components/dialogs/dialogTrigger";

export type OverlayTileModel = {
    className?: string,
    image: ImageModel,
    text: string,
    link?: FlexibleLinkModel,
    video?: VideoModel,
    videoPrompt?: string,
    linkIcon?:string,
    secondaryImageWidth?: number,
    secondaryImageOffsetX?: number,
    secondaryImageOffsetY?: number
}

export default function OverlayTile({ className, image, text, link, video, videoPrompt, linkIcon,
    secondaryImageWidth, secondaryImageOffsetX, secondaryImageOffsetY }: OverlayTileModel) {
    var label = link?.label;
    const formattedText = label?.replace(/(\s)/, '$1\n');
    const partsArray = formattedText?.split('\n');
    const donate = partsArray?.[0]?.toString() || '';
    const support = partsArray?.[1]?.toString() || '';
    let customOverlayPositionStyle : NodeJS.Dict<any> = {};
    
    if (secondaryImageOffsetX && secondaryImageOffsetX != 0) {
        customOverlayPositionStyle.left = `${secondaryImageOffsetX}px`;
    }
    if (secondaryImageOffsetY && secondaryImageOffsetY != 0) {
        customOverlayPositionStyle.bottom = `${16 - secondaryImageOffsetY}px`;
    }
    if (image && secondaryImageWidth && secondaryImageWidth > 0) {
        secondaryImageWidth = secondaryImageWidth;
    }
    else {
        if (image) {
            secondaryImageWidth = image.width;
        }
    }
    return (
        <div className={styles.overlayTile + (className ? ' ' + className : '')}>
            {image &&
                <div className={styles.imageContainer}>
                    <div className={styles.image} style={customOverlayPositionStyle} >
                        <Image src={getAbsoluteMediaUrl(image.url)} width={secondaryImageWidth}
                            height={secondaryImageWidth ? (image.height * (secondaryImageWidth / image.width)) : image.height} alt={image.name} />
                    </div>
                </div>
                
            }
            <div>
                <Rte className={styles.rte} text={text} />
                {link &&
                    <div className="darkBackground small-margin-top-1 medium-margin-top-2">
                        {
                            linkIcon != 'bmg-icon-heart' ?
                                <CircleLink link={link} />
                                :
                            <a href={link.attributes.href} className={`bmg-icon  ${linkIcon} ${styles.circle_Icon} `} ><span>{donate} <span>{support}</span></span></a>

                        }

                    </div>
                }
            </div>
            
            {video && videoPrompt &&
                <div className="darkBackground small-margin-top-1 medium-margin-top-2">
                    <DialogTrigger className={styles.newsletterPrompt} id={video.url}>
                        <a className={styles.playLink}><i className="bmg-icon bmg-icon-play"></i>{videoPrompt}</a>
                    </DialogTrigger>
                    <VideoDialog video={video} id={video.url} />
                </div>
            }
        </div>
    )
}