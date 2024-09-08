import BasicDialog from '@components/dialogs/basicDialog'
import React, { forwardRef, useContext, useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, Slide, TextField, Typography } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import styles from '../../../../umbracoForm/submitButton.module.scss';
import { ErrorMessage, Field, Form, Formik, useFormikContext } from 'formik';
import * as Yup from 'yup';
import styles1 from './productdetail.module.scss';

import { Button, Input } from '@mui/material';
import { AddToCartContext, ProductType } from './addToCartProvider';

type AddToCartProps = {
    open: boolean,
    setOpen: (open: boolean) => void,
    onClose?: any,
    onOpen?: () => void,
    //productInfo: NodeJS.Dict<any>
    productInfo: ProductType

}

const AddToCart = ({ open, setOpen, onClose, onOpen, productInfo }: AddToCartProps) => {
    
    
    const { state, dispatch } = useContext(AddToCartContext);
    const productQuantityTotal = state.productInfo.length > 0 ? state.productInfo.find((item) => item.productTitle === productInfo.productTitle)?.quantity : 1
    const [productQuantity, setProductQuantity] = useState(productQuantityTotal || 1);
    const [errorMsg, setShowErrorMsg] = useState('')

    useEffect(() => {
        setProductQuantity(productQuantityTotal || 1)
        
        // if(state.productInfo.length > 0){
        //     console.log('useeffect---------', state.productInfo)
        //     localStorage.setItem('cart', JSON.stringify(state))
        // }
        
    }, [state]);

    

    const addOrUpdateCart = () => {

        let productInfoWithQuantity = { ...productInfo, quantity: productQuantity } as ProductType;
        dispatch({ action: 'addOrUpdateQuantity', productInfo: productInfoWithQuantity });
        localStorage.setItem('cart', JSON.stringify({ productInfo: [...state.productInfo, productInfoWithQuantity] }))
        setProductQuantity(1);
        onClose();


    }
    const Transition = forwardRef(function Transition(
        props: TransitionProps & {
            children: React.ReactElement<any, any>
        },
        ref: React.Ref<unknown>
    ) {
        return <Slide direction="up" ref={ref} {...props} onExited={() => {
            if (onClose) {
                onClose();
            }
        }} onEnter={() => {
            if (onOpen) {
                onOpen();
            }
        }} />;
    });
    return (
        <Dialog
            onClose={onClose}
            aria-labelledby="customized-dialog-title"
            open={open}
            fullWidth
            maxWidth={'sm'}
        >

            <DialogContent dividers>
                <Typography align='center' gutterBottom>
                    <Formik
                        initialValues={{
                            quantity: productQuantity
                        }}
                        validationSchema={
                            Yup.object().shape({
                                quantity: Yup.number()
                                    .required('Quantity is required')
                                    .min(1, 'Quantity must be at least 1')
                            })
                        }
                        onSubmit={values => {
                            console.log('Form submitted with values:', values);
                        }}
                    >
                        {({ setFieldValue }) => {
                            const handleIncrement = (e: any) => {
                                const newQuantity = productQuantity + 1;
                                setProductQuantity(newQuantity);
                                setFieldValue('quantity', newQuantity);
                            };

                            const handleDecrement = (e: any) => {
                                if (productQuantity > 0) {
                                    const newQuantity = productQuantity - 1;
                                    setProductQuantity(newQuantity);
                                    setFieldValue('quantity', newQuantity);
                                }
                            };

                            const handleQuantityChange = (e: any) => {
                                const newQuantity = parseInt(e.target.value);
                                if (!newQuantity) {
                                    setProductQuantity(1);
                                }
                                setProductQuantity(newQuantity);
                                setFieldValue('quantity', newQuantity);
                            };
                            return (<Form className={styles1.cartForm}>
                                <h2>Add to cart</h2>
                                <div className='text-center'>
                                    <Button type="button"  onClick={handleDecrement} variant="contained" color="primary" disabled={productQuantity === 1}>-</Button>
                                    <TextField
                                        //as={TextField}
                                        id="outlined-basic"
                                        className={styles1.textInputQuanity}
                                        onChange={handleQuantityChange}
                                        label="Quantity"
                                        variant="outlined"
                                        type="number"
                                        name="quantity"
                                        inputProps={{readOnly: true}}
                                        
                                        // If the product is found in the state, use its quantity, otherwise default to 0
                                        value={productQuantity}
                                    />
                                   
                                    <Button type="button" onClick={handleIncrement} variant="contained" color="primary">+</Button>
                                </div>
                                {/* <Button type="submit" variant="contained" color="primary">Submit</Button> */}
                            </Form>
                            );
                        }}
                    </Formik>
                </Typography>
            </DialogContent>
            <DialogActions>
                <button className={`${styles.btnClose} ${styles.btnDefault}`} onClick={addOrUpdateCart}>
                    Add to cart
                </button>
                <button className={styles.btnClose} onClick={onClose}>Cancel</button>
            </DialogActions>
        </Dialog >
    )
}

export default AddToCart