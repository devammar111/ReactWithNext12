import { getCropUrl, getMediaDimensions } from "@lib/umbraco/util/helpers";
import { ImageModel } from "@lib/umbraco/types/imageModel.type";
import { WidgetModel } from "@lib/umbraco/types/widgetModel.type";
import Rte from "../../rte";
import WidgetWrapper from "../widgetWrapper";
import Image from "next/image";
import styles from './textWithImages.module.scss';
import { ChangeEvent, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { gsap } from "@lib/greensock/all";
import useScreenWidth from "common/util/useScreenWidth";
import { FlexibleLinkModel } from "@lib/umbraco/types/flexibleLinkModel.type";
import { number } from "yup";

export type TextWithImagesModel = {
    text: string,
    images: ImageModel[]
    baseImage: ImageModel,
    secondaryImageWidth: number,
    secondaryImageOffsetX: number,
    secondaryImageOffsetY: number,
    isBackgroundDark?: boolean,
    background: ImageModel,
    extraPadding: boolean,
    removeDefaultPadding: boolean,
    dropdownOptions: FlexibleLinkModel[],
    dropdownPlaceholder: string,
}
export default function TextWithImages(model: WidgetModel) {
    const ref = useRef<HTMLDivElement>(null);
    const animated = useRef(false);
    const { width } = useScreenWidth();
    const router = useRouter();

    let baseBackgroundUmbracoStyle: NodeJS.Dict<any> = {};
    let spacerDivWidthStyle: NodeJS.Dict<any> = {};
    let spacerDivExtraPaddingStyle: NodeJS.Dict<any> = {};
    let backgroundObj: NodeJS.Dict<any> = {};
    let baseImageClass = '';
    let containerWithBackgroundClass = '';
    let layoutRightAlignedClass = '';
    let autoMinHeightClass = '';
    let extraPaddingClass = '';
    let removeTopPaddingClass = '';
    let seconImageLeftPaddingClass = '';
    let percentageWidth = 0;
    let percentageRight = 0;
    let percentageTop = 0;
    var { text, images, baseImage, secondaryImageWidth, secondaryImageOffsetX, secondaryImageOffsetY, isBackgroundDark,
        background, extraPadding, removeDefaultPadding, dropdownOptions, dropdownPlaceholder } = model.content as TextWithImagesModel;
    if (baseImage && baseImage != null) {
        percentageWidth = secondaryImageWidth && secondaryImageWidth != 0 ?
            (secondaryImageWidth * 100) / 781 : (baseImage.width * 100) / 781;
        //Default From Left is 400px;
        percentageRight = secondaryImageOffsetX && secondaryImageOffsetX != 0 ? ((400 - secondaryImageOffsetX) * 100) / 781 : 0;

        baseBackgroundUmbracoStyle.width = `${percentageWidth}%`;
        if (model.layout === "LeftAligned") {
            baseBackgroundUmbracoStyle.left = `-${percentageRight}%`;
            baseImageClass = ' ' + styles.leftAligned;
        }
        else {
            baseBackgroundUmbracoStyle.left = `${percentageRight}%`;
            baseImageClass = ' ' + styles.rightAligned;
            layoutRightAlignedClass = ' ' + styles.layoutRightAligned;
        }

    }
    if (baseImage) {
        if (baseImage) {
            spacerDivExtraPaddingStyle.width = `${percentageWidth}%`;
            const baseImageWidth = secondaryImageWidth && secondaryImageWidth != 0 ? secondaryImageWidth : baseImage.width;
            const padding = (80 + secondaryImageOffsetY) * 100 / 781;
            console.log(padding);
            if (padding > 0) {
                spacerDivExtraPaddingStyle.paddingTop = padding + '%';
            }
            else {
                baseBackgroundUmbracoStyle.bottom = -padding + '%';
            }
        }
    }

    const sizes = {
        "portrait": getMediaDimensions(images[0], "portrait") || { width: 0, height: 0 },
        "landscape": getMediaDimensions(images[0], "landscape") || { width: 0, height: 0 }
    }

    useEffect(() => {
        const container = ref.current;
        if (container && !animated.current) {
            const images = container?.querySelectorAll('div');

            if (container && images) {
                const image1 = images[0];
                const image2 = images[1];
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: images[0],
                        start: 'top 40%',
                        invalidateOnRefresh: true
                    },
                    paused: true
                })
                    .fromTo(image1, { x: (model.layout === 'RightAligned' ? '-50%' : '50%'), autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: .5 })
                    .fromTo(image2, { y: '50%', autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .5, delay: -.2 });
                animated.current = true;
            }
        }
    }, []);

    function handleChangeDropdown(e: ChangeEvent<HTMLSelectElement>) {
        if (e.target.value) {
            var indexString = e.target.value;
            var indexNumber: number = +indexString;
            const selectedItem = dropdownOptions[indexNumber];
            if (selectedItem.newTab) {
                window.open(selectedItem?.attributes.href, '_blank');
                return;
            }
            else if (selectedItem?.attributes
                && selectedItem?.attributes.href &&
                selectedItem?.attributes.href?.indexOf("http") >= 0) {
                var linkURL = new URL(selectedItem?.attributes.href);
                if (window.location.host == linkURL.host) {
                    router.push('/' + linkURL.pathname);
                    return;
                }
                window.open(selectedItem?.attributes.href, '_self');
                return;
            }
            router.push('/' + selectedItem?.attributes.href);
        }
    }

    let backgroundClass = '';
    let leftPanelClass = `cell small-12 medium-12 large-5`;
    let rightPanelClass = `cell small-12 medium-12 large-7`;

    if (background) {
        backgroundClass += ' grid-container ';
        backgroundObj.backgroundImage = `url('${getCropUrl(background, 'background')}')`;
        if (baseImage && baseImage != null) {
            backgroundObj.opacity = '0.9';
        }
        containerWithBackgroundClass = styles.containerWithBackground + " small-padding-bottom-2 medium-padding-bottom-3 small-padding-top-2 medium-padding-top-3";
        if (isBackgroundDark) {
            backgroundClass += ' darkBackground ';
        }
        if (!baseImage) {
            leftPanelClass += ` ${styles.leftPanel}`;
            rightPanelClass += ` ${styles.rightPanel}`;
        }
        if (images.length >= 2) {
            containerWithBackgroundClass += ' ' + styles.extraPaddingWithBackground;
            seconImageLeftPaddingClass = ' ' + styles.seconImageLeftPadding;
        }

    } else {
        //containerWithBackgroundClass = "small-margin-top-1 medium-margin-top-2 large-padding-top-1 large-margin-top-3"
    }
    if (!baseImage && !background) {
        autoMinHeightClass = ' ' + styles.autoMinHeight;
    }
    if (extraPadding) {
        extraPaddingClass = ' ' + styles.extraPadding;
    }
    if (removeDefaultPadding) {
        removeTopPaddingClass = ' ' + styles.removeTopPadding;
    }
    return (
        <WidgetWrapper model={model} className={containerWithBackgroundClass + layoutRightAlignedClass + extraPaddingClass} styles={styles} style={background ? backgroundObj : undefined}>

            <div className={backgroundClass}>
                <div className={styles.flexContainer} style={{ display: 'flex', flexDirection: model.layout !== 'RightAligned' ? "row" : "row-reverse" }}>
                    <div className={leftPanelClass}>
                        <div className={styles.contentSec + removeTopPaddingClass}>
                            <Rte text={text} />
                        </div>
                        {dropdownOptions && dropdownOptions?.length > 0 &&
                            <div>
                                <select name="lang" className={styles.dropdown} onChange={handleChangeDropdown}>
                                    <option value="" >{dropdownPlaceholder}</option>
                                    {dropdownOptions.map((item, index) => {
                                        return (
                                            <option key={'lnItem-' + index} value={index} >{item.label}</option>
                                        )
                                    }

                                    )}
                                </select>
                            </div>
                        }


                    </div>

                    <div className={rightPanelClass} ref={ref}>
                        <div className={styles.imageContainer}>
                            <div className={styles.twoImageContainer}>
                                {images &&
                                    images.map((image, index) => {
                                        const crop = index % 2 === 0 ? "landscape" : "portrait";
                                        const size = sizes[crop];
                                        return (
                                            <div key={'image-' + index} className={styles.image + seconImageLeftPaddingClass}>
                                                <Image src={getCropUrl(image, crop)} width={size.width} height={size.height} alt={image.name} />
                                            </div>
                                        )
                                    }

                                    )
                                }
                            </div>
                            {baseImage &&
                                <div className={styles.baseImageContainer + baseImageClass} style={baseBackgroundUmbracoStyle}>
                                    <Image src={getCropUrl(baseImage, 'landscape', baseImage.width, baseImage.height)} height={baseImage.height} width={baseImage.width} alt={baseImage.name} />

                                </div>
                            }
                            {images.length >= 2 &&
                                <div className={styles.spacer} style={spacerDivWidthStyle}>
                                    <div style={spacerDivExtraPaddingStyle} ></div>
                                </div>
                            }
                        </div>

                    </div>
                </div>
            </div>

        </WidgetWrapper>
    )
}