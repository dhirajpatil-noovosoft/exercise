import React, { Component } from "react";
import { observer } from "mobx-react";
import ApiStore from "./ApiStore";

@observer
class CartPage extends Component {
    // Calculate the total number of items in the cart
    getTotalItemsInCart = () => {
        return ApiStore.cart.reduce((acc, item) => acc + item.quantity, 0);
    };

    render() {
        const totalItems = this.getTotalItemsInCart(); // Get total items count
        return (
            <div>
                <h1>Cart Page</h1>
                {totalItems === 0 ? (
                    <p>Your cart is empty</p>
                ) : (
                    <div>
                        {ApiStore.cart.map((item) => (
                            <div key={item.id} style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                                <img src={item.thumbnail} alt={item.title} style={{ width: "100px" }} />
                                <div style={{ flex: 1 }}>
                                    <h3>{item.title}</h3>
                                    <p><strong>Price:</strong> ${item.price}</p>
                                    <p><strong>Quantity:</strong> {item.quantity}</p>
                                </div>
                                <div>
                                    <button onClick={() => ApiStore.updateCartQuantity(item.id, -1)}>-</button>
                                    <button onClick={() => ApiStore.removeFromCart(item.id)}>Remove</button>
                                    <button onClick={() => ApiStore.updateCartQuantity(item.id, 1)}>+</button>
                                </div>
                            </div>
                        ))}
                        <h3>Total Items: {totalItems}</h3>
                    </div>
                )}
            </div>
        );
    }
}

export {CartPage};


// fine