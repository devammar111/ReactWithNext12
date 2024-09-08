import LabelledContentModel from '@lib/umbraco/types/labelledContentModel';
import { WidgetModel } from '@lib/umbraco/types/widgetModel.type';
import WidgetWrapper from '../widgetWrapper';
import AccordionItem from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails'
import styles from './accordion.module.scss';
import Grid from '@components/grid/grid';
import { style } from '@mui/system';
import { useState } from 'react';
import { ImageModel } from '@lib/umbraco/types/imageModel.type';
import { getCropUrl } from '@lib/umbraco/util/helpers';

export type AccordionModel = {
    background: ImageModel,
    title: string,
    items: LabelledContentModel[]
}

export default function Accordion(model: WidgetModel) {
    var { items, title, background } = model.content as AccordionModel;
    let backgroundObj: NodeJS.Dict<any> = {};
    let backGroundLayoutClass = '';
    let centeredLayoutClass = '';
    const [expandeds, setExpanded] = useState<string[]>([]);
    const handleChange = (panel: string) => () => {
        setExpanded((prevExpanded) =>
            prevExpanded.includes(panel)
                ? prevExpanded.filter((item) => item !== panel)
                : [...prevExpanded, panel]
        );
    };
    let accordionIcons = {
        expandedIcon: <span className={styles.chevronUp + ' bmg-icon bmg-icon-chevron-up'}></span>,
        collapsedIcon: <span className={styles.chevronDown + ' bmg-icon bmg-icon-chevron-down'}></span>,
    }

    if (model.layout === "PlusIcon" || model.layout === "Background") {
        accordionIcons = {
            expandedIcon: <span className={styles.expandedIcon}>&#8722;</span>,
            collapsedIcon: <span className={styles.collapsedIcon}>&#65291;</span>,
        }
        if (background) {
            backGroundLayoutClass += 'grid-container';
            centeredLayoutClass += styles.centeredLayout
            backgroundObj.backgroundImage = `url('${getCropUrl(background, 'background')}')`;
        }
    }

    return (
        <WidgetWrapper model={model} styles={styles} style={backgroundObj}>
            <div className={backGroundLayoutClass}>
                <div className={centeredLayoutClass}>
                    {title &&
                        <h3 className={"darkBackground"}>{title}</h3>
                    }

                    {items.map(item =>
                        <AccordionItem key={item.label} classes={{ root: styles.item }} expanded={expandeds.includes(item.label)} onChange={handleChange(item.label)}>
                            <AccordionSummary classes={{ root: styles.summary, expanded: styles.expanded }} expandIcon={expandeds.includes(item.label) ? accordionIcons.expandedIcon : accordionIcons.collapsedIcon}>
                                <h4 className={styles.title}>{item.label}</h4>
                            </AccordionSummary>
                            <AccordionDetails classes={{ root: styles.details }}>
                                <Grid {...item.bodyText} />
                            </AccordionDetails>
                        </AccordionItem>
                    )}.
                </div>

            </div>

        </WidgetWrapper>
    )
}