import React, {Component} from "react";
import RootStore from "../stores/RootStore";
import "../App.css"
interface PropType {
    product: {
        id: number;
        thumbnail: string;
        title: string;
        description: string;
        price: number;
        quantity?:number;
    };
    page?:string
}

interface Type{ id: number; title: string; price: number; thumbnail: string; quantity: number }

class productView extends Component<PropType>{
    product:any = []
    rootStore = RootStore
    constructor(props:any) {
        super(props);
        this.product = this.props.product
        this.rootStore = RootStore;
    }
    check(id: string): boolean {
        const existingCartItems: Array<Type> = this.rootStore.cartStore.cartMap.get(this.rootStore.userStore.selectedUser) || [];
        if (Array.isArray(existingCartItems)) {
            return existingCartItems.find(item => item.id === Number(id)) !== undefined;
        }
        return false;
    }

    checkQuantity(id: string): number {
        const existingCartItems: Array<Type> = this.rootStore.cartStore.cartMap.get(this.rootStore.userStore.selectedUser) || [];
        if (Array.isArray(existingCartItems)) {
            const item = existingCartItems.find(item => item.id === Number(id));
            return item ? item.quantity : 0;
        }
        return 0;
    }

    render() {
        this.product = this.props.product
        return <>
            <div key={this.product.id} style={{display: "flex", alignItems: "center", marginBottom: "20px"}}>
                <div style={{width: "20%"}}>
                    <img src={this.product.thumbnail} alt={this.product.title} style={{width: "100px"}}/>
                </div>
                <div style={{width: "60%"}}>
                    <h3>{this.product.title}</h3>
                    <h3>Category : {this.product.category}</h3>
                    <p><strong>Description:</strong> {this.product.description}</p>
                    <p><strong>Price:</strong> ${this.product.price}</p>
                    {this.props.page==="cart"&& <p><strong>Quantity : </strong> {this.product.quantity}</p>}
                </div>
                <div className="product">
                    {((this.check(this.product.id) && this.props.page==="home") || (this.props.page==="cart"))? (
                        <div style={{display: "flex", alignItems: "center"}}>
                            <button className="removeFromCart"
                                    onClick={() => this.rootStore.cartStore.updateCartQuantity(this.product.id, -1)}>-
                            </button>
                            {(this.props.page === "home") ? <span>{this.checkQuantity(this.product.id)}</span> :
                                <button className="removeFromCart"
                                        onClick={() => this.rootStore.cartStore.removeFromCart(this.product.id)}>Remove
                                </button>}
                            <button className="addToCart"
                                    onClick={() => this.rootStore.cartStore.updateCartQuantity(this.product.id, 1)}>+
                            </button>
                        </div>
                    ) : (
                        <button className="addToCart" onClick={() => this.rootStore.cartStore.addToCart(this.product)}>Add to Cart</button>
                    )}
                </div>

            </div>
        </>
    }
}

export default productView;