import IconLink from "@components/links/iconLink";
import { IconLinkModel } from "@lib/umbraco/types/iconLinkModel.type";
import { ImageModel } from "@lib/umbraco/types/imageModel.type";
import { WidgetModel } from "@lib/umbraco/types/widgetModel.type";
import styles from './iconLinks.module.scss'
import WidgetWrapper from "../widgetWrapper";
import { getAbsoluteMediaUrl, getAlteredImageUrl, getCropUrl } from "@lib/umbraco/util/helpers";
import Image from "next/image";
import Rte from "../../rte";

export type IconLinksModel = {
    intro?: string,
    links: IconLinkModel[],
    background: ImageModel,
    backgroundOverlay?: ImageModel,
    overlayPosition?: string
}

export default function IconLinks(model : WidgetModel) {
    const {intro, links, background, backgroundOverlay, overlayPosition} = model.content as IconLinksModel;
    var overlayStyles = '';
    let backgroundImageObj: NodeJS.Dict<any> = {};
    if (overlayPosition) {
        const parts = overlayPosition.split(' ');
        overlayStyles = ' ' + styles['horizontal-' + parts[0]] + ' ' + styles['vertical-' + parts[1]];
    }
    if (model.layout === "FullHeight") {
        backgroundImageObj.backgroundImage = `url('${getCropUrl(background, 'fullHeight')}')`;
    }
    else {
        backgroundImageObj.backgroundImage = `url('${getAlteredImageUrl(background, { width: 1920 })}')`;

    }

    return (
        <WidgetWrapper model={model} styles={styles} className={model.layout === "FullHeight" ? "fullHeight":""} style={backgroundImageObj}>
            {backgroundOverlay && 
                <div className={styles.overlay + overlayStyles} style={{ width: backgroundOverlay.width + 'px' }}>
                    <Image src={getAbsoluteMediaUrl(backgroundOverlay?.url)} width={backgroundOverlay.width} height={backgroundOverlay.height} alt={backgroundOverlay.name} />
                </div>
            }
            <div className={styles.container + " grid-container"}>
                {!!intro &&
                    <Rte className="darkBackground small-margin-bottom-2 medium-margin-bottom-3" text={intro} />
                }
                <div className={styles.links + " grid-x grid-margin-x"}>
                    {links.map((link, index) => <div key={index} className={styles.cell + " cell"}>
                        <IconLink className={styles.tileLink} link={link} />
                    </div>)}
                </div>
            </div>
        </WidgetWrapper>
    )
}