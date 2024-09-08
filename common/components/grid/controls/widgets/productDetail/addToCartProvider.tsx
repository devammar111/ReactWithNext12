import { ImageModel } from "@lib/umbraco/types/imageModel.type";
import React, { createContext, Dispatch, ReactNode, ReducerAction, useReducer } from "react";


export type ProductImageType = {
    width: number,
    height: number,
    name: string,
    url: string
}

export type ProductType = {
    id?: string,
    productTitle: string,
    price: number,
    desciption?: string,
    quantity: number
    image: ImageModel
}

export type AddToCartState = {
    productInfo: ProductType[],
    totalQuanity: number,
    totalPrice: number
}

export type DialogEvent = {
    action: string,
    productInfo: ProductType,
    initialState?: ProductType[]
}

type ResetAction = {
    action: string,
    productInfo?: ProductType,
};

type ActionType = DialogEvent | ResetAction;





export const reducer = (state: AddToCartState, event: DialogEvent): AddToCartState => {
    switch (event.action) {
        case "updateStateFromLocalStorage":
            let updatedProductInfo5: any = event.productInfo;
            if (updatedProductInfo5 && updatedProductInfo5.length > 0) {
                let totalQuanity5 = updatedProductInfo5.reduce((total: any, product: any) => total + product.productQuantity, 0);
                let totalPrice5 = updatedProductInfo5.reduce((total: any, product: any) => total + product.price * product.productQuantity, 0);
                return {
                    ...state,
                    productInfo: updatedProductInfo5,
                    totalQuanity: totalQuanity5,
                    totalPrice: totalPrice5
                };
            }
            return state;

        case "addOrUpdateQuantity":
            let updatedProductInfo = [...state.productInfo];
            const existingProduct = updatedProductInfo.find(product => product.productTitle === event.productInfo.productTitle);
            if (existingProduct) {
                const updatedItem = { ...existingProduct, quantity: event.productInfo.quantity }
                updatedProductInfo = [...updatedProductInfo.filter(product => product.productTitle !== event.productInfo.productTitle), updatedItem]



            } else {
                // If the product doesn't exist, add it to the array
                updatedProductInfo = [...updatedProductInfo, event.productInfo]
                // updatedProductInfo.push(event.productInfo);
            }
            return {
                ...state,
                productInfo: updatedProductInfo,
            };

        case "removeProduct":
            return {
                ...state,
                productInfo: state.productInfo.filter(product => product.productTitle !== event.productInfo.productTitle),
                //totalQuanity: state.totalQuanity - event.productInfo.productQuantity,
                //totalPrice: state.totalPrice - event.productInfo.price * event.productInfo.productQuantity
            };
        case "init_stored":
            return {
                ...state,
                productInfo: event.initialState || []
            }
        case "updateQuantity":
            const updatedProductInfo1 = state.productInfo.map(product =>
                product.productTitle === event.productInfo.productTitle ? event.productInfo : product
            );
            //let totalQuanity2 = updatedProductInfo1.reduce((total, product) => total + product.productQuantity, 0);
            //let totalPrice2 = updatedProductInfo1.reduce((total, product) => total + product.price * product.productQuantity, 0);
            return {
                ...state,
                productInfo: updatedProductInfo1,
                totalQuanity: 5,
                totalPrice: 7
            };
        case "clearCart":
            return {
                productInfo: [],
                totalQuanity: 0,
                totalPrice: 0
            }
        default:
            return state;
    }
};

export const initialState = {
    productInfo: [],
    totalQuanity: 0,
    totalPrice: 0
} as AddToCartState;

export type AddToCartContextModel = {
    state: AddToCartState,
    dispatch: Dispatch<ReducerAction<typeof reducer>>,

}

export const AddToCartContext = createContext<AddToCartContextModel>({
    state: initialState,
    dispatch: () => null
});

export type AddToCartProviderProduct = {
    children: ReactNode
}

export const AddToCartProvider = ({ children }: AddToCartProviderProduct) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    return (
        <AddToCartContext.Provider value={{ state, dispatch }}>
            {children}
        </AddToCartContext.Provider>
    )
}