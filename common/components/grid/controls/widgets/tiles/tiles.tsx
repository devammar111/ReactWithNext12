import LazyVideo from "@components/video/lazyVideo";
import Video from "@components/video/video";
import { ImageModel } from "@lib/umbraco/types/imageModel.type";
import { VideoModel } from "@lib/umbraco/types/videoModel.type";
import { WidgetModel } from "@lib/umbraco/types/widgetModel.type";
import { GetCroppedImage, getCropUrl } from "@lib/umbraco/util/helpers";
import Rte from "../../rte";
import WidgetWrapper from "../widgetWrapper";
import styles from './tiles.module.scss';

export type TileItem = {
    text: string,
    image?: ImageModel,
    video?: VideoModel,
    hashLink?: string
}

export type TilesModel = {
    rows: TileItem[]
}

export default function Tiles(model : WidgetModel) {
    const {rows} = model.content as TilesModel;
    return (
        <WidgetWrapper model={model}>
            {rows.map((row, index) => 
                <div className={styles.row} key={'row-' + index} id={row.hashLink}>
                    <div className={styles.media}>
                        {row.video ? (
                            <LazyVideo video={row.video} thumbnail={row.image} />
                        ) : (
                            row.image &&
                                <div className={styles.image} style={{backgroundImage: "url('" + getCropUrl(row.image, 'halfScreen') + "')"}}>
                                    {GetCroppedImage(row.image, 'halfScreen')}
                                </div>
                        )}
                    </div>
                    <div className={styles.text}>
                        <div className={styles.textContainer}>
                            <Rte text={row.text} />
                        </div>
                    </div>
                </div>    
            )}
        </WidgetWrapper>
    )
}