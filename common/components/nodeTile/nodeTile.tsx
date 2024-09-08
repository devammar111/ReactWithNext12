import { UmbracoNode } from "@lib/umbraco/types/umbracoNode.type";
import ArticleTile from "./tiles/articleTile";
import NewsTile from "./tiles/newsTile";
import PersonTile from "./tiles/personTile";
import VideoTile from "./tiles/videoTile";
import ImageTile from "./tiles/imageTile"
import EventTile from "./tiles/eventTile";
import ProductTile from "./tiles/productTile";
import { Url } from "url";
import CategoryTile from "./tiles/categoryTile";

export type NodeTileModel = {
    content: UmbracoNode,
    viewDetailsPrompt?: string,
    truncateSummaryCharacters?: number,
    product?: any,
    image?: any,
    variant?: string,
    url?: string,
    categoryurl?: string
}

export default function NodeTile({ content, viewDetailsPrompt, truncateSummaryCharacters, variant, product, image, url, categoryurl }: NodeTileModel) {
    switch (content.contentTypeAlias) {
        case 'person':
            return <PersonTile {...content} />
        case 'article':
            return <ArticleTile content={content} viewDetailsPrompt={viewDetailsPrompt} truncateSummaryCharacters={truncateSummaryCharacters} />
        case 'newsItem':
            return <NewsTile content={content} viewDetailsPrompt={viewDetailsPrompt} />
        case 'video':
            return <VideoTile {...content} />
        case 'product':
            return <ProductTile content={content} />
        case 'event':
            return <EventTile content={content} viewDetailsPrompt={viewDetailsPrompt} />
        default:
            return (
                <div>
                    <p>No tile set for `{content.contentTypeAlias}`</p>
                </div>
            )
    }
}