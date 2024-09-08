import Link from 'next/link';
import Image from 'next/image';
import styles from './footer.module.scss';
import InlineList from '../inline-list/inline-list';
import IconLink from '../links/iconLink';
import FlexibleLink from '../links/flexibleLink';
import { CommonData } from '../../../lib/umbraco/types/commonData.type';
import Rte from '../grid/controls/rte';
import DialogTrigger from '../dialogs/dialogTrigger';
import { getAbsoluteMediaUrl } from '../../../lib/umbraco/util/helpers';

export default function Footer(data: CommonData) {
    return (
        <footer className={styles.footer + ' blueBackground'}>
            <div className="grid-container">
                <div className={styles.contactMethods}>
                    <div className={styles.contactMethodsCell}>
                        <div className={styles.logo}>
                            <Link href="/">
                                <a><Image src={getAbsoluteMediaUrl(data.logo.url)} layout="fill" alt={data.logo.name} /></a>
                            </Link>
                        </div>
                        <div className={styles.contactCol + ' grid-x small-up-1 medium-up-2'}>
                            <div className="cell">
                                <Rte text={data.contactInfo} className={styles.contactInfoCell + ' ' + styles.contactInfoCellRte} />
                            </div>
                            <div className="cell">
                                {
                                    data.hours.map((hours, index) =>
                                        <div key={index} className={styles.contactInfoCell + ' ' + styles.contactInfoCellRange}>
                                            <h6>{hours.description}</h6>
                                            <p>{hours.timeframe}</p>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    <div className={styles.contactMethodsCell}>
                        <div className={styles.newsletterContainer}>
                            <div className={styles.newsletterBlock}>
                                <DialogTrigger className={styles.newsletterPrompt} id={data.newsletterModal}>
                                    <a><i className="bmg-icon bmg-icon-email"></i>{data.newsletterPrompt}</a>
                                </DialogTrigger>
                                <InlineList narrow={true} items={data.socialLinks.map(item =>
                                    <IconLink key={item.link.label} link={item} />
                                )} className={styles.newsletteInlineList} />
                            </div>
                        </div>
                        <InlineList className={styles.contactLinks} items={data.emphasizedLinks.map(item =>
                            <FlexibleLink key={item.label} className="roundedButton" link={item} />
                        )} />
                    </div>
                </div>
                <ul className={styles.footerLinks + ' noBullets'}>
                    {
                        data.footerLinks.map((link,index) =>
                            <li key={index}>
                                <FlexibleLink className={styles.topLink} link={link.link} />
                                <ul>
                                    {link.children && link.children.length &&
                                        link.children.map((child, innerIndex) =>
                                            <li key={innerIndex}>
                                                <FlexibleLink link={child} />
                                            </li>
                                        )
                                    }
                                </ul>
                            </li>
                        )
                    }
                </ul>
                <div className={styles.copyright}>
                    <span>{data.copyright.replace('[year]', new Date().getFullYear().toString())}</span>
                    <InlineList className={styles.bottomLinks + ' noBullet'} narrow={true} divider={true} items={data.bottomLinks.map(item =>
                        <FlexibleLink key={item.label} link={item} />
                    )} />
                    <p>
                        Designed and Developed by <a rel="noreferrer" href="https://bonsaimediagroup.com" target="_blank">Bonsai Media Group</a>
                    </p>
                </div>
            </div>
        </footer>
    )
}