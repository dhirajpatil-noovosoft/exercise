import React, {Component} from "react";
import ApiStore from "./ApiStore";
interface PropType {
    product: {
        id: number;
        thumbnail: string;
        title: string;
        description: string;
        price: number;
    };
}


class productView extends Component<PropType>{
    product:any = []
    apiStore = ApiStore
    constructor(props:any) {
        super(props);
        this.product = this.props.product;
        this.apiStore = ApiStore;
    }
    check (id:any){
        const existsingCartItems:any = this.apiStore.cartMap.get(this.apiStore.userid);
        for(let i = 0 ; i < existsingCartItems?.length ; i++)
            if(existsingCartItems[i].id === id) {
                console.log("found")
                return true
            }
        return false
    }
    checkQuantity(id:any){
        const existsingCartItems:any = this.apiStore.cartMap.get(this.apiStore.userid);
        for(let i = 0 ; i < existsingCartItems?.length ; i++)
            if(existsingCartItems[i].id === id) {
                return existsingCartItems[i].quantity
            }
        return 0
    }
    render() {
        return <>
            <div key={this.product.id} style={{display: "flex", alignItems: "center", marginBottom: "20px"}}>
                <>{this.apiStore.userid}</>
                <div style={{width: "20%"}}>
                    <img src={this.product.thumbnail} alt={this.product.title} style={{width: "100px"}}/>
                </div>
                <div style={{width: "60%"}}>
                    <h3>{this.product.title}</h3>
                    <h3>Category : {this.product.category}</h3>
                    <p><strong>Description:</strong> {this.product.description}</p>
                    <p><strong>Price:</strong> ${this.product.price}</p>
                </div>
                <div style={{width: "20%", textAlign: "right"}}>
                    {this.check(this.product.id) ? (
                        <div style={{display: "flex", alignItems: "center"}}>
                            <button onClick={ () => this.apiStore.updateCartQuantity(this.product.id, -1)}>-</button>
                            <span>{this.checkQuantity(this.product.id)}</span>
                            <button onClick={ () => this.apiStore.updateCartQuantity(this.product.id, 1)}>+</button>
                        </div>
                    ) : (
                        <button onClick={() => this.apiStore.addToCart(this.product)}>Add to Cart</button>
                    )}
                </div>
            </div>
        </>
    }
}

export default productView;