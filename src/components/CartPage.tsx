import React, { Component } from "react";
import { observer } from "mobx-react";
import RootStore from "../stores/RootStore";
import "../App.css"
@observer
class CartPage extends Component {
    rootStore = RootStore;
    constructor(props: any) {
        super(props);
        this.rootStore = RootStore;
    }
    async componentDidMount() {
        await this.rootStore.setParticularCart(this.rootStore.selectedUser);
        await this.rootStore.setSelectedUser(this.rootStore.selectedUser)
        await this.rootStore.getUser();
    }

    // Calculate the total number of items in the cart
    getTotalItemsInCart = () => {
        let num: number = 0;
        const items = this.rootStore.cartMap.get(this.rootStore.userid) || [];
        for (let i = 0; i < items.length; i++) {
            num += items[i].quantity;
        }
        return num;
    };

    render() {
        const totalItems = this.getTotalItemsInCart(); // Get total items count
        console.log("cart ", this.rootStore.cartMap.get(this.rootStore.userid))
        return (
            <div>
                <div style={{ display: "flex" }}>
                    <h1>{this.rootStore.userName}'s cart</h1>
                    <h3>Total Items: {totalItems}</h3>
                </div>
                {this.rootStore.cartMap.get(this.rootStore.userid)?.length ? (
                    <div>
                        {this.rootStore.cartMap.get(this.rootStore.userid)?.map((item: any) => (
                            <div key={item.id} style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                                <img src={item.thumbnail} alt={item.title} style={{ width: "100px" }} />
                                <div style={{ flex: 1 }}>
                                    <h3>{item.title}</h3>
                                    <p><strong>Price:</strong> ${item.price}</p>
                                    <p><strong>Quantity:</strong> {item.quantity}</p>
                                    <p><strong>Category:</strong> {item.category}</p>
                                </div>
                                <div>
                                    <button className="removeFromCart" onClick={() => this.rootStore.updateCartQuantity(item.id, -1)}>-</button>
                                    <button className="removeFromCart" onClick={() => this.rootStore.removeFromCart(item.id)}>Remove</button>
                                    <button className="addToCart" onClick={() => this.rootStore.updateCartQuantity(item.id, 1)}>+</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <></>
                )}
            </div>
        );
    }
}

export { CartPage };
