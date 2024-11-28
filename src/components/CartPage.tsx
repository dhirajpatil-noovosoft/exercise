import React, { Component } from "react";

import { observer } from "mobx-react";
import ApiStore from "./ApiStore";

@observer
class CartPage extends Component {
    apiStore = ApiStore;

    constructor(props:any) {
        super(props);
        this.apiStore = ApiStore;
    }
    // Calculate the total number of items in the cart
    getTotalItemsInCart = () => {
            let num : number = 0
            const items = this.apiStore.cartMap.get(this.apiStore.userid) || []
            for(let i = 0 ; i < items.length ; i++)
                num += items[i].quantity
            return num;
    }

    render() {
        const totalItems = this.getTotalItemsInCart(); // Get total items count
        return (

            <div>
                <div style={{display:"flex"}}>
                    <h1 >{this.apiStore.userName}'s cart</h1>
                    <h3 >Total Items: {totalItems}</h3>
                </div>
                {(this.apiStore.cartMap.get(this.apiStore.userid)?.length ) &&   <div>
                        { this.apiStore.cartMap.get(this.apiStore.userid)?.map((item:any) => (
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

                    </div>}
            </div>
        );
    }
}

export {CartPage};


// fine