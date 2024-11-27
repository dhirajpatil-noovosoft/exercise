import React, { Component } from "react";
import { observer } from "mobx-react";
import ApiStore from "./ApiStore";

@observer
class CartPage extends Component {
    apiStore = ApiStore;
    constructor(props:any) {
        super(props);
        this.apiStore = ApiStore
    }
    // Calculate the total number of items in the cart
    getTotalItemsInCart = () => {
        if(this.apiStore.cart[Number(this.apiStore.userid)] === undefined)
            return 0
        return this.apiStore.cart[Number(this.apiStore.userid)]?.reduce((acc, item) => acc + item.quantity, 0);
    };

    render() {
        const totalItems = this.getTotalItemsInCart(); // Get total items count
        return (
            <div>
                <div style={{display:"flex"}}>
                    <h1 >{this.apiStore.userid}'s cart</h1>
                    <h3 >Total Items: {totalItems}</h3>
                </div>
                {totalItems === 0 ? (
                    <p>Your cart is empty</p>
                ) : (
                    <div>
                        {this.apiStore.cart[Number(this.apiStore.userid)]?.map((item) => (
                            <div key={item.id} style={{display: "flex", alignItems: "center", marginBottom: "20px"}}>
                                <img src={item.thumbnail} alt={item.title} style={{width: "100px"}}/>
                                <div style={{flex: 1}}>
                                    <h3>{item.title}</h3>
                                    <p><strong>Price:</strong> ${item.price}</p>
                                    <p><strong>Quantity:</strong> {item.quantity}</p>
                                </div>
                                <div>
                                    <button onClick={() => this.apiStore.updateCartQuantity(item.id, -1)}>-</button>
                                    <button onClick={() => this.apiStore.removeFromCart(item.id)}>Remove</button>
                                    <button onClick={() => this.apiStore.updateCartQuantity(item.id, 1)}>+</button>
                                </div>
                            </div>
                        ))}

                    </div>
                )}
            </div>
        );
    }
}

export {CartPage};


// fine