import { useRef, useState } from 'react';
import { gsap } from '../../../lib/greensock/all';
import { LinkWithChildren } from '../../../lib/umbraco/types/linkWithChildren.type';
import styles from './dropdownLink.module.scss';
import FlexibleLink from './flexibleLink';

export default function DropdownLink(link: LinkWithChildren) {
    const [open, setOpen] = useState(false);
    const children = useRef<HTMLUListElement>(null);

    const toggleChildren = () => {
        setOpen(!open);
        if (children.current) {
            if (!open) {
                children.current.style.height = 'auto';
                const height = children.current.clientHeight;
                children.current.style.height = '';
                gsap.timeline()
                    .to(children.current, { height: height, duration: .3})
            }
            else {
                gsap.timeline()
                    .to(children.current, { height: 0, duration: .3})
            }
        }
    }

    return (
        <div className={styles.dropdownLink}>
            <div className={styles.linkBlock}>
                <FlexibleLink link={link.link} />
                {link.children && link.children.length > 0 &&
                    <a className={styles.expander + (open ? ' ' + styles.active : '') + ' bmg-icon bmg-icon-chevron-right hide-for-large'} onClick={toggleChildren}></a>
                }
            </div>
            {link.children && link.children.length > 0 &&
                <ul className={styles.dropdown} ref={children}>
                    {
                        link.children.map((child,index) =>
                            <li key={index}>
                                <FlexibleLink link={child} />
                            </li>
                        )
                    }
                </ul>
            }
        </div>
    )
}