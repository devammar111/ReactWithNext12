import { WidgetModel } from "@lib/umbraco/types/widgetModel.type";
import { getCropUrl, getMediaDimensions } from "@lib/umbraco/util/helpers";
import { useState } from 'react';
import Image from "next/image";
import styles from './videos.module.scss';
import WidgetWrapper from "../../widgetWrapper";
export default function Videos(model: WidgetModel) {
    const [visibleImages, setVisibleImages] = useState(6);
    const handleLoadMore = () => {
        setVisibleImages(prevCount => prevCount + 3);
    };
    var Model = model.content.videos;
    const sizes = {
        "portrait": getMediaDimensions(Model[0].bannerImage, "portrait") || { width: 0, height: 0 },
        "landscape": getMediaDimensions(Model[0].bannerImage, "landscape") || { width: 0, height: 0 }
    }
    const getLayout = () => {
        return (

            <div className={styles.videos_sec}>
          
                <div className={styles.gridcontainer}>
                    <h3 className={styles.textcenter}><strong>{model.content.heading}</strong></h3>
                    <div className={`${styles.row} ${styles.flex_row}`}>
                        {Model.slice(0, visibleImages).map((item: any, index: any) => {
                            
                            const crop = index % 2 === 0 ? "landscape" : "portrait";
                            const size = sizes[crop]
                            return (
                                <div className={styles.colmd4} key={index}>
                                    <div className={styles.video_image}>
                                        <Image src={getCropUrl(item.bannerImage, crop)} width={size.width} height={size.height} layout="responsive" alt={item.bannerImage.name } />
                                    </div>
                                    <a href={item.video.url}>
                                        <h2><Image alt={"play-circle-outline"} src="/play-circle-outline.svg" width={50} height={50} />{item.heading}</h2>
                                    </a>
                                    <p>Duration: {item.video != "" ? Math.floor(item.video.duration / 60)+":" +item.video.duration % 60 : "2:18"}</p>
                                </div>
                            )
                        })
                        }
    
                    <div className={`${styles.textcenter} ${styles.col12}`}>
						<a onClick={handleLoadMore} className={`${styles.btn} ${styles.custom_btn}`}>LOAD MORE</a>
					</div>
                    </div>
                </div>
        </div>
            
            
        )
                    }
    return (
        <WidgetWrapper styles={styles} model={model}>
            {getLayout()}
        </WidgetWrapper>
    )

    
}