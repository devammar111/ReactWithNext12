import { ImageModel } from "@lib/umbraco/types/imageModel.type";
import { WidgetModel } from "@lib/umbraco/types/widgetModel.type";
import { getAlteredImageUrl, getCropUrl } from "@lib/umbraco/util/helpers";
import WidgetWrapper from "../widgetWrapper";
import styles from './ImageWithIcon.module.scss'
import image from "next/image";
import IconLink from "@components/links/iconLink";

export type ImageWithIconModel = {
    backgroundImage: string,
    baseImage: ImageModel,
}


export default function ImageWithIcon(model: WidgetModel) {

var Modal = model.content;
const backgroundStyles = {
    backgroundImage: `url('${getAlteredImageUrl(Modal.backgroundImage, {width: 1920})}')`,
};


return(
    <WidgetWrapper model={model} styles={styles} >
        <div className={styles.backgroundImage} style={backgroundStyles}>
          <div className="grid-container">
            <div className={styles.colRow}>
                {Modal.imageWithText.map((link:any, index:any) => <div key={index} className={styles.col4}>
                    <div className={styles.squareBox}>
                        <i className={`bmg-icon ${link.icons} ${styles.icons} `}></i>
                        <h4>{link.title}</h4>
                    </div>
                </div>)}
            </div>
          </div>
          </div>
        </WidgetWrapper>
)

}