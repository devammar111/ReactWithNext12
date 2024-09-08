import { WidgetModel } from "@lib/umbraco/types/widgetModel.type";
import WidgetWrapper from "../widgetWrapper";
import styles from './gridTabs.module.scss';
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { GridSection } from "@lib/umbraco/types/gridSection.type";
import Grid from "@components/grid/grid";
import { ImageModel } from "../../../../../../lib/umbraco/types/imageModel.type";
import { filterLocationsByCategory, getAssociateCategoriesFromLocationsWithoutIcons, getCropUrl } from "../../../../../../lib/umbraco/util/helpers";
import { useCurrentPageContext } from "../../../../layout/layout";
import { useCollection, useCollectionInfinite } from "../../../../../../lib/umbraco/util/publicDataApi";
import { UmbracoNode } from "../../../../../../lib/umbraco/types/umbracoNode.type";
import locations from "../../../../../../lib/umbraco/types/locations.type";
import { FlexibleLinkModel } from "../../../../../../lib/umbraco/types/flexibleLinkModel.type";

export type GridTabItem = {
    label: string,
    grid: GridSection,
    segment: string

}

export type GridTabsModel = {
    title: string,
    gridItems: GridTabItem[],
    background: ImageModel,
    sources?: UmbracoNode[],
    query?: string,
    allowedTypes?: string[],
    tagCategory: UmbracoNode[]
}

function Tab({ content, active }: {
    content: GridSection,
    active: boolean
}) {
    if (!active) {
        return null;
    }
    return (
        <Grid {...content} />
    )
}

export default function GridTabs(model: WidgetModel) {
    const router = useRouter();
    const [locationItems, setLocationItems] = useState<locations[] | null>([]);

    const { title, gridItems, background, sources, allowedTypes, tagCategory } = model.content as GridTabsModel;
    let backgroundImage = {};

    if (background) {
        backgroundImage = {
            backgroundImage: `url('${getCropUrl(background, 'fullWidth')}')`
        };
    }
    const currentPage = useCurrentPageContext();
    const { data, error, mutate, isValidating } = useCollection(currentPage.id, 1, 0, sources?.map(source => source.id), "", allowedTypes);
    const isEmpty = data?.length === 0;
    const [category, setCategory] = useState(tagCategory.length > 0 ? tagCategory[0].name : "");
    const [active, setActive] = useState(0);
    const [locationCategories, setLocationCategories] = useState<string[]>([]);
    const handleClick = (e: any, category: string, index: number) => {
        e.preventDefault();
        let items = data as locations[];
        debugger;
        setLocationItems(filterLocationsByCategory(items, category));
        setActive(index);

    };
    function handleWebsiteLink(e: any, link: string) {
        e.preventDefault();
        // Add the protocol back if it's missing
        var completeLink = link.startsWith("http://") || link.startsWith("https://") ? link : "https://" + link;
        window.open(completeLink, '_blank');
        return;

    }
    useEffect(() => {
        if (!isEmpty) {
            let locData = data as locations[];
            if (tagCategory.length == 0) {
                var categoriesData = getAssociateCategoriesFromLocationsWithoutIcons(locData);
                setLocationItems(filterLocationsByCategory(locData, categoriesData[0]));
                setCategory(categoriesData[0]);
                setLocationCategories(categoriesData);

            }
            else {
                setLocationItems(filterLocationsByCategory(locData, category));
            }
        }

        var index = -1;
        if (router.asPath.indexOf('#') > -1) {
            const hash = router.asPath.split('#')[1];
            index = gridItems.findIndex(x => x.segment === hash);
        }
        if (index > -1) {
            setActive(index);
        }
    }, [router, data])
    if (model.variant === 'Locations') {
        return <WidgetWrapper className="small-margin-bottom-2 medium-margin-bottom-3 medium-margin-top-3 small-margin-top-2" model={model} styles={styles} style={backgroundImage}>
            <div className={styles.tabsContainer}>
                <h3 className="text-center">{title}</h3>
                <div className="grid-container">

                    <ul className={styles.tabs + " noMargin row"}>
                        
                        {tagCategory.length > 0 &&
                            tagCategory?.map((item, index) => (
                            <li key={"index-" + index}>
                                <Link href="#" >
                                    <a onClick={(e) => handleClick(e, item.name, index)} className={index === active ? styles.active : undefined}>{item.name}</a>
                                </Link>
                            </li>
                            ))}
                        {locationCategories.length > 0 &&
                            locationCategories?.map((item, index) => (
                                <li key={"index-" + index}>
                                    <Link href="#" >
                                        <a onClick={(e) => handleClick(e, item, index)} className={index === active ? styles.active : undefined}>{item}</a>
                                    </Link>
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
            <div className="grid-x grid-margin-x small-margin-bottom-2 medium-margin-bottom-3 medium-margin-top-2 small-margin-top-1">
                <div className={styles.locationContentContainer + " grid-container"}>
                    <div className="row">
                        {locationItems?.map((item, index) => {
                            return (
                                <div key={'content-' + index} className={styles.locationContent + " text-center cell medium-6 large-4"}>
                                    <h5>{item.name}</h5>
                                    <h6 className="linkText"><a className="linkText" href={`tel:${item.properties?.phoneNumber}`}>{item.properties?.phoneNumber}</a></h6>
                                    {/*<h6><a rel="noreferrer" href={item.properties.website} target={'_blank'} className="linkText">{item.properties.website}</a></h6>*/}
                                    <h6><a onClick={(e) => handleWebsiteLink(e, item.properties?.website)} href={"#"} className="linkText">{item.properties?.website?.replace("https://", "").replace("http://", "")}</a></h6>
                                </div>
                            );
                        })
                        }
                    </div>
                </div>

            </div>

        </WidgetWrapper>
    }
    else {
        return <WidgetWrapper className="small-margin-bottom-2 medium-margin-bottom-3 medium-margin-top-3 small-margin-top-2" model={model} styles={styles} style={backgroundImage}>
            {gridItems.length > 1 &&
                <div className={styles.tabsContainer}>
                    <h3>{title}</h3>
                    <ul className={styles.tabs + " noMargin"}>
                        {gridItems.map((item, index) => (
                            <li key={item.label}>
                                <Link href={'#' + item.segment}>
                                    <a className={index === active ? styles.active : undefined}>{item.label}</a>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            }
            {gridItems.length > 1 &&
                <div className={styles.tabsContent + " small-margin-bottom-2 medium-margin-bottom-3 medium-margin-top-2 small-margin-top-1"}>
                    {gridItems.map((item, index) => (
                        <Tab key={item.label} content={item.grid} active={index === active} />
                    ))}
                </div>
            }

        </WidgetWrapper>
    }
}