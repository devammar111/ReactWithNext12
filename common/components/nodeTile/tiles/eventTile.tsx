import { formatDateRange } from "@lib/umbraco/util/helpers";
import { NodeTileModel } from "../nodeTile";
import styles from "./eventTile.module.scss";

export default function EventTile({ content, viewDetailsPrompt }: NodeTileModel) {
    var eventStartDate = new Date(content.properties.startDate);
    var eventEndDate = new Date(content.properties.endDate);
    const formattedDateRange = formatDateRange(eventStartDate, eventEndDate);

    return (
        <div className={styles.eventTile}>
            <div>
                <h4>{formattedDateRange}</h4>
                <h2 className="redText"><a href={content.url}>{content.name}</a></h2>
                {!!content.properties.summary &&
                    <p>
                        {content.properties.summary}
                        {viewDetailsPrompt &&
                            <a className={styles.readMore} href={content.url}>{viewDetailsPrompt}</a>
                        }
                    </p>
                }
            </div>
        </div>
    )
}