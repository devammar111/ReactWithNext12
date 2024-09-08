import { WidgetModel } from "@lib/umbraco/types/widgetModel.type";
import styles from './productdetail.module.scss';
import { ImageModel } from "../../../../../../lib/umbraco/types/imageModel.type";
import WidgetWrapper from "../widgetWrapper";
import { GetCroppedImage } from "@lib/umbraco/util/helpers";
import Image from "next/image";
import Rte from "../../rte";
import { useEffect, useState } from "react";
import AddToCart from "./addToCart";
import { useCurrentPageContext } from "@components/layout/layout";
import { useCollection } from "@lib/umbraco/util/publicDataApi";
import { useRouter } from "next/router";
import CircularProgress from "@mui/material/CircularProgress";
import { ProductType } from "./addToCartProvider";

export type RichTextPairModel = {
    backgroundImage: ImageModel,
    leftPanel: string,
    rightPanel: string,
    id: number;
}
export default function ProductDetail(model: WidgetModel) {
    const [open, setOpen] = useState(false);

    const openModal = () => {
        setOpen(true);
    }






    return (

        <>
            <WidgetWrapper styles={styles} model={model} className="large-padding-top-3 medium-padding-bottom-1 medium-padding-top-1 small-padding-bottom-1 small-padding-top-1">
                <div className={styles.productContainer}>
                    <div className={styles.productImage}>{GetCroppedImage(model.content.image, 'thumbnail')}</div>
                    <div className={styles.productDetail}>
                        <h5>{model.content.productTitle}</h5>
                        <span>{model.content.currency} {model.content.price}</span> <br />
                        <div className={styles.buttonContainer}>
                            <button className={styles.addToCartButton} onClick={openModal}>
                                <Image alt={"icon-cart"} src="/icon-cart.svg" width={18} height={18} />
                                Add to cart
                            </button>
                            <button className={styles.addToWishList}>
                                <Image alt={"icon-wishlist"} src="/icon-wishlist.svg" width={18} height={18} />
                                Add to wishlist
                            </button>
                        </div>
                        <div className={styles.productDescription}>
                            <h5 className={styles.descriptionText}>Description</h5>
                            <Rte text={model.content.desciption} />
                        </div>
                    </div>
                </div>

                <div className={styles.productImagePreviewContainer}>
                    {model.content.additionalImages.map((img: ImageModel) => {
                        // eslint-disable-next-line react/jsx-key
                        return <div className={styles.productImagePreview}>{GetCroppedImage(img, 'thumbnail')}</div>
                    })}
                </div>


            </WidgetWrapper>
            {open && <AddToCart open={open} setOpen={setOpen} productInfo={model.content as ProductType} onClose={() => setOpen(false)} />}
        </>
    )
}