import React, { createContext, useEffect, useState } from "react";


export const ShopContext = createContext(null);
const getDefaultCart = () => {
    let cart = {};
    for (let index = 0; index < 300+1; index++) {
        cart[index] = 0;
    }
    return cart;
}

const ShopContextProvider = (props) => {
    const url = "https://full-stack-ecommerce-y6sw.onrender.com"
    const [all_product, setAll_Product] = useState([]);
    const [cartItems,setCartItems] = useState(getDefaultCart());

     useEffect(() => {
        fetch('http://localhost:4000/all-products')
        .then(res => res.json())
        .then(data => setAll_Product(data));

        if(localStorage.getItem('auth-token')){
            fetch('http://localhost:4000/getcart',{
                method: 'POST',
                headers: {
                            Accept: 'application/form-data', 
                            'auth-token': `${localStorage.getItem('auth-token')}`, 
                            'Content-Type': 'application/json'
                        },
                body: ""
            })
            .then((res) => res.json())
            .then((data) => setCartItems(data));
        }
    },[])

    
     const addToCart = (itemId) => {
        setCartItems((prev) => ({...prev,[itemId]:prev[itemId]+1}));
        if(localStorage.getItem('auth-token')){
            fetch('http://localhost:4000/addtocart', {
                method: 'POST',
                headers: {
                            Accept: 'application/form-data', 
                            'auth-token': `${localStorage.getItem('auth-token')}`, 
                            'Content-Type': 'application/json'
                        },
                body: JSON.stringify({"itemId": itemId})
            })
            .then((res) => res.json)
            .then((data) => console.log(data))
        }
     }

     const removeFromCart = (itemId) => {
        setCartItems((prev) => ({...prev,[itemId]:prev[itemId]-1}));   
         if(localStorage.getItem('auth-token')){
            fetch('http://localhost:4000/removefromcart', {
                method: 'POST',
                headers: {
                            Accept: 'application/form-data', 
                            'auth-token': `${localStorage.getItem('auth-token')}`, 
                            'Content-Type': 'application/json'
                        },
                body: JSON.stringify({"itemId": itemId})
            })
            .then(res => res.json)
            .then(data => console.log(data))
        }
     }

     const getTotalCartValue = () => {
        let total_amount = 0;
        for (const item in cartItems) {
            if(cartItems[item]>0){
                let itemInfo = all_product.find((product) => product.id===Number(item));
                total_amount += (itemInfo.new_price * cartItems[item]);
            }
        }
        return total_amount;
    }
    const getTotalCartItems = () => {
        let total_items = 0;
        for (const item in cartItems){
            var current_item_quantity = cartItems[item];
            if(current_item_quantity>0){
                total_items += current_item_quantity;
            }
        }
        return total_items;
    }
     const contextValue = {all_product,cartItems,addToCart,removeFromCart,getTotalCartValue,getTotalCartItems};    

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;
