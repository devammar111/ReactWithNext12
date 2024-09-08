import { WidgetModel } from "../../../../../../lib/umbraco/types/widgetModel.type";
import { getAbsoluteMediaUrl, getCropUrl, getMediaDimensions } from "../../../../../../lib/umbraco/util/helpers";
import Image from "next/image";
import { useState } from 'react';
import styles from './multipleImages.module.scss';
import WidgetWrapper from "../widgetWrapper";
import { ImageModel } from "@lib/umbraco/types/imageModel.type";
export type MultipleImagesModel = {
    images: ImageModel[],
    title: string
}
export default function MultipleImages(model: WidgetModel) {
    var { images, title } = model.content as MultipleImagesModel;
    var Model = model.content.mutipleImages;
    const [visibleImages, setVisibleImages] = useState(6);
    const handleLoadMore = () => {
        setVisibleImages(prevCount => prevCount + 3);
    };
    const sizes = {
        "portrait": getMediaDimensions(images[0], "portrait") || { width: 0, height: 0 },
        "landscape": getMediaDimensions(images[0], "landscape") || { width: 0, height: 0 }
    }
    return (
        <WidgetWrapper model={model} styles={styles}>
            <div>
                <div className={styles.title}>
                    <h3>{title}</h3>
                </div>

                <div className="grid-x grid-margin-x small-up-1 medium-up-2 large-up-3">
                    {images.slice(0, visibleImages).map((item: ImageModel, index: any) => {

                        return (
                            <div className={styles.cellContainer + ' cell'} key={'photo-item-' + item.id + ' ' + index}>
                                <Image src={getAbsoluteMediaUrl(item.url)} width={419} height={272} layout="responsive" alt={item.name} />
                            </div>
                        )
                    })
                    }
                </div>

                <div className={styles.loadMoreBtn}>
                    {visibleImages < model.content.images.length &&

                        <a onClick={handleLoadMore} className={styles.customBtnLoadMore}>LOAD MORE</a>
                    }
                </div>

            </div>
        </WidgetWrapper>
    )

}