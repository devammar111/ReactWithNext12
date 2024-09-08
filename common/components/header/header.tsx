import Image from 'next/image';
import styles from './header.module.scss';
import InlineList from '../inline-list/inline-list';
import DropdownLink from '../links/dropdownLink';
import FlexibleLink from '../links/flexibleLink';
import IconLink from '../links/iconLink';
import Link from '../links/link';
import VerticalLink from '../links/verticalLink';
import { CommonData } from '../../../lib/umbraco/types/commonData.type';
import { IconLinkModel } from '../../../lib/umbraco/types/iconLinkModel.type';
import { getAbsoluteMediaUrl } from '../../../lib/umbraco/util/helpers';
import { useContext, useEffect, useRef, useState } from 'react';
import HamburgerToggle from './hamburgerToggle';
import { gsap, ScrollTrigger } from '@lib/greensock/all';
import variables from "@styles/variables.module.scss";
import { Timeline } from '@lib/greensock/gsap-core';
import { time } from 'console';
import { AddToCartContext } from '@components/grid/controls/widgets/productDetail/addToCartProvider';
import ContinueShopping from './countinueShoping';

export type HeaderModel = {
    data: CommonData,
    startTransparent: boolean
}

export default function Header({ data, startTransparent }: HeaderModel) {
    const [open, setOpen] = useState(false);
    const { state, dispatch } = useContext(AddToCartContext);
    
    const arrayQuantities = state.productInfo.length > 0 ? state.productInfo.map((item) => item.quantity) : [];
    const totalQuantities = arrayQuantities.reduce((next, number) => {
        return next + number;
    }, 0);

    useEffect(() => {
        if (localStorage.getItem("cart")) {
            let persistantState = JSON.parse(localStorage.getItem("cart") || '')
            if (persistantState) {
                dispatch({
                    action: "init_stored",
                    initialState: persistantState.productInfo,
                    productInfo: persistantState.productInfo
                });
            }
        }
    }, []);
     
    const animated = useRef(false);
    const timeline = useRef(gsap.timeline());
    const [totalQuanity, setTotalQuanity] = useState(0);
    const container = useRef<HTMLDivElement>(null);

    const [openCheckOut, setCheckOutOpen] = useState(false);

    const openModal = () => {
        setCheckOutOpen(true);
    }

    const toggleOpen = () => {
        setOpen(!open);
    }

    const closeMenu = () => {
        setOpen(false);
    }

    var verticalLink: IconLinkModel = {
        icon: data.verticalLinkIcon,
        link: data.verticalLink
    };

    useEffect(() => {
        if (container.current) {
            if (startTransparent) {
                if (!animated.current) {
                    const settings: NodeJS.Dict<() => void> = {};
                    settings['(min-width: ' + variables.breakpointLarge + ')'] = () => {
                        timeline.current = gsap.timeline({
                            scrollTrigger: {
                                id: 'header',
                                trigger: container.current,
                                scrub: true,
                                start: 0,
                                end: () => '+=' + container.current?.clientHeight
                            }
                        })
                            .fromTo(container.current, { backgroundColor: 'transparent' }, { background: '#ACB5C9', duration: 1 }); // had to hard code color value due to issues caused by react calling this twice
                    }
                    ScrollTrigger.matchMedia(settings);
                    animated.current = true;
                }
            }
            else if (animated.current) {
                timeline.current.kill();
                ScrollTrigger.getById('header').kill();
                container.current.style.backgroundColor = '';
                animated.current = false;
            }
        }
    }, [startTransparent])

    return (
        <>
            <header className={styles.header + ' darkBackground' + (open ? ' ' + styles.menuOpen : '')} ref={container}>
                <div className={`${styles.container} grid-container`}>
                    <div className={styles.logoContainer}>
                        <Link href="/">
                            <a className={styles.logo}><Image src={getAbsoluteMediaUrl(data.logo.url)} layout="fill" alt={data.logo.name} /></a>
                        </Link>
                    </div>
                    <div className="hide-for-large">
                        <HamburgerToggle className={styles.hamburgerToggle} active={open} toggle={toggleOpen} />
                    </div>
                    <div className={styles.main}>
                        <div className={styles.links}>
                            <div className={styles.secondaryLinks}>
                                <InlineList restrict="large" items={data.secondaryLinks.map(item =>
                                    <FlexibleLink key={item.label} link={item} />
                                )} />
                                <InlineList className={styles.spaced} narrow={true} items={data.socialLinks.map(item =>
                                    <IconLink key={item.link.label} link={item} />
                                )} />
                                <span onClick={openModal}>
                                    <InlineList className={styles.spaced} items={data.additionalLinks.map(item =>
                                        // <IconLink key={item.link.label} className="large" link={item} />
                                        <span><i className={`${styles.bmgIconHoverable} bmg-icon ' + ${item.icon}`}></i></span>
                                    )} /> {totalQuantities > 0 && <span style={{ color: '#b2334e', fontWeight: 'bold', paddingBottom: '5px' }}>{totalQuantities}</span>}
                                </span>
                            </div>
                            <div className={styles.mainLinks}>
                                <InlineList restrict="large" items={data.mainLinks.map(item =>
                                    <DropdownLink key={item.link.label} {...item} />
                                )} />
                                {data.buttonLink &&
                                    <FlexibleLink className={'button ' + styles.button} link={data.buttonLink} />
                                }
                            </div>
                        </div>
                        {data.verticalLink &&
                            <>
                                <IconLink className={'button hide-for-large ' + styles.button} link={verticalLink} iconAfter={true} />
                                <VerticalLink className="hide-for-medium-down" link={verticalLink} />
                            </>
                        }
                    </div>
                </div>
                <div className={styles.overlay} onClick={closeMenu}></div>
            </header>
            <div className={styles.spacer + (startTransparent ? '' : ' ' + styles.active)}></div>
            {
                openCheckOut && <ContinueShopping open={openCheckOut} setOpen={setCheckOutOpen} onClose={() => setCheckOutOpen(false)} />
            }

        </>
    )
}
