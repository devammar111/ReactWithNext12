import React, { Fragment } from 'react';
import mapClass from '../../util/mapClass';
import styles from './inline-list.module.scss';

export type InlineListData = {
    items: React.ReactNode[],
    className?: string,
    narrow?: boolean,
    divider?: boolean,
    restrict?: string
}

export default function InlineList({ items, narrow, className, divider, restrict }: InlineListData) {
    return (
        <ul className={`${styles[restrict ? restrict + 'InlineList' : 'inlineList']} ${narrow ? styles.narrow : ''} ${mapClass(styles, className)}`}>
            {
                items.map((item, index) =>
                    <Fragment key={index}>
                        {divider && index > 0 &&
                            <li className={styles.divider}></li>
                        }
                        <li>
                            {item}
                        </li>
                    </Fragment>
                )
            }
        </ul>
    )
}