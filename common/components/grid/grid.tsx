import { createContext, useContext } from "react";
import { GridSection } from "../../../lib/umbraco/types/gridSection.type";
import ConditionalWrapper from "../../util/conditionalWrapper";
import Base from "./controls/base";
import styles from './grid.module.scss';
const IsDarkContext = createContext<boolean>(false);

export const useIsDarkContext = () => {
    return useContext(IsDarkContext);
}
export default function Grid(content: GridSection) {
    return (
        <div className={styles.grid}>
            {content.rows.map((row, index) => {
                const fullWidth = row.config?.settings?.fullWidth === "1";
                const columnSize = row.config?.settings?.desktopColumns === "1" ? "large" : "medium";
                const isBackgroundColor = row.config?.styles?.backgroundColor || row.config?.styles?.backgroundImage ? true : false;
                let paddingAppliedClass = '';
                let isRowBottomBorder = '';
                if (row.config?.classes && row.config?.classes.length > 0) {
                    paddingAppliedClass = ' ' + styles.paddingApplied;
                }
                if (row.config?.classes && row.config?.classes.indexOf('border-bottom-1') >= 0) {
                    isRowBottomBorder = ' borderBottom';
                }
                return (
                    <div key={'row-' + index} className={(isBackgroundColor ? styles.rowWithBackground : '')}>
                        {isBackgroundColor &&
                            <div className={styles.widgetWithBackground + paddingAppliedClass} style={row.config?.styles}></div>
                        }
                        <div className={row.config?.classes?.join(' ') + ' ' + styles.row + isRowBottomBorder}>

                            <div className={"grid-container" + (fullWidth ? ' full' : '')}>
                                <div className="grid-x grid-margin-x area" >
                                    {row.cells.map((cell, cellIndex) =>
                                        <div key={'cell-' + index + '-' + cellIndex} className={'cell ' + columnSize + '-' + cell.size + ' ' + cell.config?.classes?.join(' ')} id={cell.config?.settings?.anchorId} style={cell.config?.styles}>
                                            {
                                                cell.controls.map((control, controlIndex) => {
                                                    return (
                                                        <div key={'control-' + index + '-' + cellIndex + '-' + controlIndex} className={control.config?.classes?.join(' ')} id={control.config?.settings?.anchorId} style={control.config?.styles}>

                                                            <Base alias={control.editorAlias} content={control.value} />
                                                        </div>
                                                    );
                                                })
                                            }
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}