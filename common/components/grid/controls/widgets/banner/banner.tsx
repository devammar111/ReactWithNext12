import { ImageModel } from "@lib/umbraco/types/imageModel.type";
import RepeatableTextWithImage from "@lib/umbraco/types/repeatableTextWithImage.type";
import { WidgetModel } from "@lib/umbraco/types/widgetModel.type";
import { getCropUrl } from "@lib/umbraco/util/helpers";
import Rte from "../../rte";
import Image from "next/image";
import WidgetWrapper from "../widgetWrapper";
import styles from "./banner.module.scss";
import OverlayTile from "@components/overlayTile/overlayTile";

export type BannerModel = {
    background: ImageModel,
    text: string,
    tiles?: RepeatableTextWithImage[],
    useDarkText: boolean,
}

export default function Banner(model: WidgetModel) {
    var { background, text, tiles, useDarkText } = model.content as BannerModel;
    let backgroundStyle: NodeJS.Dict<any> = {};
    if (model.layout === 'FullImage') {
        backgroundStyle = {};
    }
    else if (model.layout === 'Short') {
        backgroundStyle.backgroundImage = `url('${getCropUrl(background, 'shortBackground')}')`;
    }
    else {
        backgroundStyle.backgroundImage = `url('${getCropUrl(background, 'background')}')`;
    }
    
    return (
        <WidgetWrapper model={model} styles={styles} style={backgroundStyle}>
            {model.layout === 'FullImage' &&
                <div className={styles.mapImage}>
                    <Image src={getCropUrl(background, 'mapImage')} width={background.width} height={background.height} alt={background.name} />
                </div>
            }
            {text &&
                <div className="grid-container">
                    <Rte className={styles.rte + (useDarkText ? "" : " darkBackground")} text={text} />
                </div>
            }
            {tiles && tiles.length > 0 &&
                <div className={styles.tiles + ' grid-container'}>
                    {tiles.map((tile, index) =>
                        // 4 mean: 80 (padding) - 16(offsetY) + 60(margin)
                        <div key={index} className={styles.cell} style={{marginTop: `${tile.image ? tile.image.height - 4 : 60 }px`}}>
                            <OverlayTile className={styles.overlayBanner} image={tile.image} text={tile.text} />
                        </div>
                    )}
                </div>
            }
        </WidgetWrapper>
    )
}