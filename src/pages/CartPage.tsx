import React, { Component } from "react";
import { observer } from "mobx-react";
import RootStore from "../stores/RootStore";
import "../App.css"
import ProductView from "../components/ProductView";
import {RouterContext} from "mobx-state-router";
@observer
class CartPage extends Component {
    static contextType = RouterContext;
    rootStore = RootStore;
    constructor(props: any) {
        super(props);
        this.rootStore = RootStore;
    }
    async componentDidMount() {
        const c : any = this.context
        await this.rootStore.setSelectedUser(c.routerState.params.id || "1")
        await this.rootStore.setParticularCart(this.rootStore.selectedUser);
        await this.rootStore.setSelectedUser(this.rootStore.selectedUser)
        await this.rootStore.getUser();
    }

    // Calculate the total number of items in the cart
    getTotalItemsInCart = () => {
        let num: number = 0;
        const items = this.rootStore.cartMap.get(this.rootStore.selectedUser) || [];
        for (let i = 0; i < items.length; i++) {
            num += items[i].quantity;
        }
        return num;
    };

    render() {
        const totalItems = this.getTotalItemsInCart(); // Get total items count
        return (
            <div>
                <div style={{ display: "flex" }}>
                    <h1>{this.rootStore.userName}'s cart</h1>
                    <h3>Total Items: {totalItems}</h3>
                </div>
                {this.rootStore.cartMap.get(this.rootStore.selectedUser)?.length ? (
                    <div>
                        {this.rootStore.cartMap.get(this.rootStore.selectedUser)?.map((item: any) => (
                           <ProductView product={item} key={item.id} page="cart"/>
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
