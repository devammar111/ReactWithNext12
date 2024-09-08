import { useCurrentPageContext } from "@components/layout/layout";
import NodeTile from "@components/nodeTile/nodeTile";
import FeaturedTile from "@components/nodeTile/tiles/featuredTile";
import { UmbracoNode } from "@lib/umbraco/types/umbracoNode.type";
import { WidgetModel } from "@lib/umbraco/types/widgetModel.type";
import { useCollectionInfinite } from "@lib/umbraco/util/publicDataApi";
import WidgetWrapper from "../widgetWrapper";
import Rte from '@components/grid/controls/rte';
import styles from './feed.module.scss';
import { groupEventsByMonthAndYear } from "@lib/umbraco/util/helpers";
import EventTile from "@components/nodeTile/tiles/eventTile";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import FeaturedProductTile from "@components/nodeTile/tiles/featuredProductTile";
import CircularProgress from "@mui/material/CircularProgress";
import CategoryTile from "@components/nodeTile/tiles/categoryTile";
import { CategoryOverrideItem } from "../productsByCategory/productsByCategory";

export type FeedModel = {
    intro: string,
    items: UmbracoNode[],
    viewDetailsPrompt?: string,
    emptyMessage: string,
    loadMorePrompt?: string,
    sources?: UmbracoNode[],
    query?: string,
    allowedContentTypes?: string[],
    pageSize: number,
    sortBy?: string,
    startDate?: Date,
    endDate?: Date,
    itemsPerRowSmall: number,
    itemsPerRowMedium: number,
    itemsPerRowLarge: number
    featuredItem?: UmbracoNode,
    featuredItemLabel?: string,
    previousLoadMore?: string,
    truncateSummaryCharacters?: number,
    upcomingLoadMore?: string,
    featuredProduct?: string,
    baseLinkText: string

}

export default function Feed(model: WidgetModel) {


    const widgetData = model.content as FeedModel;
    const [visibleProducts, setVisibleProducts] = useState(3);
    const handleLoadMore = () => {
        setVisibleProducts(prevCount => prevCount + 3);
    };
    let eventItems: [string, UmbracoNode[]][] = [] as [string, UmbracoNode[]][];
    const [isLoadPrevious, setIsLoadPrevious] = useState<null | boolean>(model.variant === "Events" ? false : null);
    const currentPage = useCurrentPageContext();
    const { data, error, mutate, size, setSize, isValidating } =
        useCollectionInfinite(currentPage.id, 1, widgetData.pageSize, widgetData.sources?.map(source => source.id), widgetData.query, widgetData.allowedContentTypes,
            widgetData.sortBy, widgetData.startDate, widgetData.endDate, false, "", isLoadPrevious);
    const loadingInitData = !data && !error;
    const loadingMore = loadingInitData || (size > 0 && data && typeof data[size - 1] === 'undefined');
    const isEmpty = data?.[0]?.length === 0;
    const endReached = isEmpty || (data && data[data.length - 1]?.length < widgetData.pageSize)
    const refreshing = isValidating && data && data.length === size;
    let videoCellClass = '';
    let productCellClass = '';
    let featuredItemWrapperClass = '';
    let customBtnLoadMoreClass = '';
    let gridContainerClass = 'grid-container';
    let loadMorebtnClass = styles.loadMoreBtn;
    let buttonsContainerClass = '';

    let cellContainerClass = `grid-x grid-margin-x small-up-${widgetData.itemsPerRowSmall} medium-up-${widgetData.itemsPerRowMedium} large-up-${widgetData.itemsPerRowLarge}`;
    const loadNextPage = () => {
        if (!endReached && !loadingMore) {
            setSize(size + 1);
        }
    }
    const loadPreviousPage = () => {
        if (isLoadPrevious == null) {
            setIsLoadPrevious(true);
        }
        else {
            setIsLoadPrevious(!isLoadPrevious);
        }
    }
    if (model.variant === "Videos") {
        videoCellClass = ' ' + styles.videoCell;
        gridContainerClass = styles.videoContainer;
        customBtnLoadMoreClass = ' ' + styles.customBtnLoadMore;
        if (!widgetData.loadMorePrompt) {
            widgetData.loadMorePrompt = "LOAD MORE";
        }
        loadMorebtnClass = styles.videoLoadMoreBtn;
    }
    if (model.variant === "Products") {
        gridContainerClass = '';
        productCellClass = ' small-margin-bottom-2 ' + styles.productCell;
        featuredItemWrapperClass += ` ${styles.featuredItemWrapper}`
    }
    let items = widgetData.items && widgetData.items.length > 0 ? widgetData.items : data ? ([] as UmbracoNode[]).concat(...data) : [] as UmbracoNode[];
    if (model.variant === "Events") {
        eventItems = groupEventsByMonthAndYear(items);
        videoCellClass = ' large-8';
        gridContainerClass = '';
        cellContainerClass = 'small-margin-top-1 medium-margin-top-2 large-margin-top-3';
        loadMorebtnClass = styles.eventLoadMoreBtn;
        buttonsContainerClass = styles.buttonsContainer;

    }
    return (
        <WidgetWrapper styles={styles} model={model}>
            <div className={gridContainerClass + styles.productIntro}>
                {!widgetData.featuredItem &&
                    <div className={styles.introfeed + " medium-margin-top-3 small-margin-top-2 small-margin-bottom-2"}>
                        <Rte text={widgetData.intro} />
                    </div>
                }
                {widgetData.featuredItem &&
                    <div className={featuredItemWrapperClass + " small-margin-bottom-2 medium-margin-bottom-3"}>
                        <div className={styles.introfeed + " medium-margin-top-3 small-margin-top-2 small-margin-bottom-2"}>
                            <Rte text={widgetData.intro} />
                        </div>


                        <div className={styles.featuredItem + " large-margin-left-3"} key={'featured-feed-item'}>
                            <FeaturedTile content={widgetData.featuredItem} featuredItemLabel={widgetData.featuredItemLabel} />
                        </div>
                    </div>
                }

                <div className="small-padding-top-2 small-padding-bottom-2 medium-padding-top-2 medium-padding-bottom-2 large-padding-top-3 large-padding-bottom-3">
                    <div className={cellContainerClass}>
                        {items.map(item => (
                            <div
                                className={'cell ' + videoCellClass + productCellClass}
                                key={'feed-item-' + item.id}
                            >
                                <NodeTile content={item} viewDetailsPrompt={widgetData.viewDetailsPrompt} truncateSummaryCharacters={widgetData.truncateSummaryCharacters} />

                            </div>
                        ))}
                    </div>
                </div>



                {widgetData.loadMorePrompt && widgetData.pageSize > 0 &&

                    // <a className={"button" + (endReached || loadingMore ? ' disabled' : '')} onClick={loadNextPage}>{widgetData.loadMorePrompt}</a>
                    <div className={buttonsContainerClass}>
                        {model.variant === "Events" &&
                            <div className={loadMorebtnClass}>
                                <div onClick={loadPreviousPage}>
                                    <span className={styles.customBtnLoadMore + ' ' + styles.customPrevBtnLoadMore}>{isLoadPrevious == false || isLoadPrevious == null ? widgetData.previousLoadMore : widgetData.upcomingLoadMore}</span>
                                </div>
                            </div>

                        }
                        {!endReached && !widgetData.baseLinkText &&
                            <div className={loadMorebtnClass} onClick={loadNextPage}>
                                {model.variant !== "Videos" && model.variant !== "Events" &&
                                    < div className={styles.circleNextIcon}><i className="bmg-icon bmg-icon-chevron-right"></i></div>
                                }
                                <div className={model.variant === "Videos" || model.variant === "Events" ? styles.customBtnLoadMore : styles.loadMore}>{widgetData.loadMorePrompt}</div>
                            </div>
                        }
                        {widgetData.baseLinkText &&
                            <div className={styles.baseLinkText}>
                                <a className={"circleLink"} href="/news/"><span className={styles.baseLinkTextLink + ' ' + 'emphasize'}>{widgetData.loadMorePrompt}</span> {widgetData.baseLinkText}</a>
                            </div>


                        }

                    </div>
                }
                {/* {
                    model.variant === "Products" && Products && Products.products &&
                    <div className={buttonsContainerClass}>
                        {visibleProducts < Products.products.length &&
                            <div className={loadMorebtnClass} onClick={handleLoadMore}>
                                < div className={styles.circleNextIcon}><i className="bmg-icon bmg-icon-chevron-right"></i></div>
                                <div className={styles.loadMore}>{widgetData.loadMorePrompt}</div>

                            </div>
                        }
                    </div>
                } */}
            </div>
        </WidgetWrapper >
    )
}