import React, { useContext, useState, useEffect } from 'react';
import { Button, Card, CardMedia, CardContent, Typography, IconButton, DialogContent, DialogActions, Dialog, Box, Divider, CircularProgress } from '@mui/material';
import styles from '../umbracoForm/submitButton.module.scss';
import { AddToCartContext, ProductType } from '@components/grid/controls/widgets/productDetail/addToCartProvider';
import { GetCroppedImage } from '@lib/umbraco/util/helpers';



type ContinueShoppingProps = {
    open: boolean,
    setOpen: (open: boolean) => void,
    onClose?: any,
    onOpen?: () => void,

}

const ContinueShopping = ({ open, setOpen, onClose, onOpen }: ContinueShoppingProps) => {
    
    const { state, dispatch } = useContext(AddToCartContext);
    const [loading, setLoading] = useState(false);
    const productFromContextState = state.productInfo.length > 0 ? state.productInfo : []
    const arrayPrices = state.productInfo.length > 0 ? state.productInfo.map((item) => item.price * item.quantity) : [];
    const sum = arrayPrices.reduce((next, number) => {
        return next + number;
      }, 0);

      useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(state))
    }, [state]);

    async function handleCheckout() {
        const cartData = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('cart') || '{}') : {};
        const products = state.productInfo.length > 0 ? state.productInfo : []
        
        if (state.productInfo.length > 0) {
            setLoading(true);
            var productsArray: any = [];
            products.forEach((item: any) => {
                var singleProduct = { Name: item.productTitle, Quantity: item.productQuantity, Price: item.price };
                productsArray.push(singleProduct);
            })
            const res = await fetch('/api/order', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(productsArray)
            });
            const data = await res.json();
            setLoading(false);
            //sessionStorage.removeItem('cartData');
            dispatch({ action: 'clearCart', productInfo: {} as ProductType });
            localStorage.removeItem('cart')

            window.open(data.payment_link.url, '_blank');
            onClose();
        }
       
    }

    const handleRemoveProduct = (productToRemove: ProductType) => {
        dispatch({action: 'removeProduct', productInfo: productToRemove})
    };

    const handleIncrmentPrduct = (newProduct: any) => {
        let productInfoWithQuantity = { ...newProduct, quantity: newProduct.quantity + 1 };
        dispatch({ action: 'addOrUpdateQuantity', productInfo: productInfoWithQuantity });
    }
    const handleDecrementPrduct = (newProduct: any) => {
        if (newProduct.quantity > 1) {
            let productInfoWithQuantity = { ...newProduct, quantity: newProduct.quantity - 1 };
            dispatch({ action: 'addOrUpdateQuantity', productInfo: productInfoWithQuantity });
        }
    }

    return (
        <Dialog
            onClose={onClose}
            aria-labelledby="customized-dialog-title-continue-shopping"
            open={open}
            fullWidth
            maxWidth={'sm'}

            


        >

            <DialogContent dividers>
                <div>
                    {productFromContextState.length > 0 ? productFromContextState.map((product, index) => (
                        <Box style={{ width: '100%' }} key={index}>
                            <Card style={{ paddingLeft: '40px' }}>
                                
                                <CardContent style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ width: '50px', height: '50px' }}>{GetCroppedImage(product.image, 'thumbnail')}</div>
                                    <Typography variant="h5">{product.productTitle}</Typography>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <IconButton onClick={() => handleDecrementPrduct(product)}>-</IconButton>
                                        <Typography>{product.quantity}</Typography>
                                        <IconButton onClick={() => handleIncrmentPrduct(product)}>+</IconButton>
                                    </div>
                                    <div>
                                        <Typography>${product.quantity * product.price}</Typography>
                                    </div>
                                    <IconButton onClick={() => handleRemoveProduct(product)}>X</IconButton>
                                </CardContent>
                            </Card>
                            <Divider /> {/* This is the separator */}
                        </Box>
                    )) : <p>No products found in this cart</p>}
                    {/* This is the total */}
                    {/* <Typography variant="h5" align='right'>Total: ${state.totalPrice}</Typography>  */}
                    <Typography variant="h5" align='right'>Total: ${sum}</Typography>
                    
                </div>
            </DialogContent>
            <DialogActions>
                <button className={`${styles.btnClose} ${styles.btnDefault}`} onClick={onClose} >
                    Continue Shopping
                </button>
                <button className={styles.btnClose} onClick={handleCheckout} disabled={state.productInfo.length === 0} >
                    {loading ? <CircularProgress size={24} /> : 'Checkout'}
                </button>
            </DialogActions>
        </Dialog >
    );
};

export default ContinueShopping;