import { getCropUrl, getMediaDimensions } from "@lib/umbraco/util/helpers";
import { ImageModel } from "@lib/umbraco/types/imageModel.type";
import { WidgetModel } from "@lib/umbraco/types/widgetModel.type";
import WidgetWrapper from "../widgetWrapper";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from './facilities.module.scss';
import Link from "next/link";
import Grid from "@components/grid/grid";
import { useRouter } from "next/router";
import facilityItem from "@lib/umbraco/types/facility.type";
import Rte from "../../rte";

function Tab({ content, active }: {
    content: facilityItem,
    active: boolean
}) {
    if (!active) {
        return null;
    }
    return (
        <div>
            {content.text &&
                <Rte text={content.text} />
            }
            <div className={styles.richImage}>
                {content.image &&
                    <Image src={getCropUrl(content.image, "fullImage")} width={419} height={272} alt={content.image.name} />
                }
            </div>
        </div>
    )
}
export type FacilitiesModel = {
    image: ImageModel, //Map Image
    title: string,
    facilityItems: facilityItem[],
}
export default function Facilities(model: WidgetModel) {
    const router = useRouter();
    const ref = useRef<HTMLDivElement>(null);
    var { image, title, facilityItems, } = model.content as FacilitiesModel;
    const [active, setActive] = useState(0);
    useEffect(() => {
        var index = 0;
        if (router.asPath.indexOf('#') > -1) {
            const hash = router.asPath.split('#')[1];
            index = facilityItems.findIndex(x => x.segment === hash);
        }
        if (index > -1) {
            setActive(index);
        }
    }, [router])
    return (
        <WidgetWrapper model={model} styles={styles} className="small-margin-top-1 medium-margin-top-1 large-margin-top-2">
            <div className={styles.container + " grid-container"}>

                <div className={styles.leftPanel + " cell large-7"}>
                    <Image src={getCropUrl(image, 'fullHeight')} height={image.height} width={image.width} alt={image.name} />

                    <ul className={styles.mapTabs}>
                        {facilityItems &&
                            facilityItems.map((item, index) => {
                                let pointerPositionStyle: NodeJS.Dict<any> = {};
                                if (item.pointerOffsetY != null && item.pointerOffsetY != 0) {
                                    pointerPositionStyle.bottom = `${((156 + item.pointerOffsetY) * 100) / 844}%`;
                                }
                                if (item.pointerOffsetX != null && item.pointerOffsetX != 0) {
                                    pointerPositionStyle.left = `${((30 + item.pointerOffsetX) * 100) / 844}%`;
                                }
                                return (
                                    <li key={item.label} style={pointerPositionStyle}>
                                        <Link href={'#' + item.segment}>
                                            <a className={index === active ? styles.active : undefined}><span className={styles.customLink + ' ' + styles.mapLink}>{index + 1}</span></a>
                                        </Link>
                                    </li>
                                )
                            }

                            )}
                    </ul>
                </div>

                <div className={styles.rightPanel + " cell large-5"} ref={ref}>
                    <h3 className={styles.title}>{title}</h3>
                    <div className={`${styles.grid} grid-x grid-margin-x small-up-1 medium-up-2 large-up-2`}>
                        {facilityItems &&
                            facilityItems.map((item, index) =>
                                <div key={'linkBar-' + index} className={styles.cell + ' cell'}>
                                    <Link href={'#' + item.segment}>
                                        <a className={(index === active ? styles.active : undefined)}><span className={styles.customLink}>{index + 1}</span><span className={styles.linkText}>{item.label}</span></a>
                                    </Link>
                                </div>
                            )
                        }
                    </div>

                    {facilityItems &&
                        <div className={styles.tabsContent + " small-margin-bottom-2 medium-margin-bottom-3 medium-margin-top-1 small-margin-top-1"}>
                            {facilityItems.map((item, index) => (
                                <Tab key={item.label} content={item} active={index === active} />
                            ))}
                        </div>
                    }
                </div>
            </div>
        </WidgetWrapper>
    )
}