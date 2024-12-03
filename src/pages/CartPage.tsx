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
        await this.rootStore.userStore.setSelectedUser(c.routerState.params.id || "1")
        await this.rootStore.cartStore.setParticularCart(this.rootStore.userStore.selectedUser);
        await this.rootStore.userStore.setSelectedUser(this.rootStore.userStore.selectedUser)
        await this.rootStore.userStore.getUser();
    }

    // Calculate the total number of items in the cart
    getTotalItemsInCart = () => {
        let num: number = 0;
        const items = this.rootStore.cartStore.cartMap.get(this.rootStore.userStore.selectedUser) || [];
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
                    <h1>{this.rootStore.userStore.selectedUser}'s cart</h1>
                    <h3>Total Items: {totalItems}</h3>
                </div>
                {this.rootStore.cartStore.cartMap.get(this.rootStore.userStore.selectedUser)?.length ? (
                    <div>
                        {this.rootStore.cartStore.cartMap.get(this.rootStore.userStore.selectedUser)?.map((item: any) => (
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
