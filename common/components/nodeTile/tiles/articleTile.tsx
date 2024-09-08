import { truncateAtWord } from "@lib/umbraco/util/helpers";
import { NodeTileModel } from "../nodeTile";
import styles from "./articleTile.module.scss";

export default function ArticleTile({ content, viewDetailsPrompt, truncateSummaryCharacters }: NodeTileModel) {
    return (
        <div className={styles.articleTile}>
            <h5>{content.name}</h5>
            <p>{truncateAtWord(content.properties.summary, 234)}</p>
            <a href={content.url}>{viewDetailsPrompt ? viewDetailsPrompt:'Read More'}</a>
        </div>
    )
}
