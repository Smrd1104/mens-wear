import { createContext } from "react";
import { products } from "../assets/frontend_assets/assets"
export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '₹';
    const deliver_fee = 10;


    const value = {
        products, currency, deliver_fee
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider