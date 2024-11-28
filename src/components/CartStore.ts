import {observable, action, makeObservable} from "mobx";
import ApiStore from "./ApiStore";
import GetCart from "./GetCart";
class CartStore{
    cartMap: Map<string, Array<{ id: number; title: string; price: number; thumbnail: string; quantity: number }>> = new Map();
    apistore = ApiStore
    userid = ''
    error:any = ''
    constructor() {
        makeObservable(this, {
            cartMap:observable,
            setCartMap:action,
            addToCart: action,
            removeFromCart: action,
            updateCartQuantity: action,
            updateCart:action
        })
        this.apistore= ApiStore
        this.cartMap = new Map();
        this.userid=this.apistore.userid
    }
    // Set error state
    setError(error: any) {
        this.error = error;
    }
    setCartMap(uid:string, cartData:any){
        this.cartMap.set(uid, cartData)
    }
    async setParticularCart(uid:string){
        if(this.cartMap.has(uid))
            return
        else {
            let currCartId = await GetCart(uid)
            this.setCartMap(uid, currCartId)
        }
    }
    // Add product to cart
    addToCart(product: { id: number; title: string; price: number; thumbnail: string }) {
        if(!this.cartMap.has(this.userid)){
            this.setCartMap(this.userid, [])
        }
        let existingProduct:number = -1
        let array:any = []
        // @ts-ignore
        let existingCartItems:[{id:number, quantity:number}] = this.cartMap.get(this.userid)
        for(let i = 0 ; i < existingCartItems?.length ; i++)
        {
            if(existingCartItems[i].id === product.id){
                existingCartItems[i].quantity += 1;
                existingProduct = i
            }
            array.push(existingCartItems[i])
        }
        if (existingProduct === -1) {
            array.push({...product, quantity:1});
        }
        this.setCartMap(this.userid, array)
    }

    // Remove product from cart
    async removeFromCart(productId: number) {
        let newCartItems = []
        const existingCartItems:any = this.cartMap.get(this.userid)
        for(let i = 0 ; i < existingCartItems?.length ; i++)
            if(existingCartItems[i].id !== productId)
                newCartItems.push(existingCartItems[i])
        this.setCartMap(this.userid, newCartItems )
    }
    // to update cart via api
    updateCart = async (id:string, product:any[])=>{
        let response = await fetch('https://dummyjson.com/carts/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: this.userid,
                products: product
            })
        })
        response = await response.json()
        return response
    }

    // Update product quantity in cart
    updateCartQuantity(productId: number, change: number) {
        const existsingCartItems:any = this.cartMap.get(this.userid) || [];
        let newItemCart:any = []
        for(let i = 0 ; i < existsingCartItems?.length ; i++) {
            if (existsingCartItems[i].id === productId) {
                existsingCartItems[i].quantity += change

            }
            if(existsingCartItems[i].quantity !== 0)
                newItemCart.push(existsingCartItems[i])
        }
        this.setCartMap(this.userid, newItemCart)
    }
}
export default CartStore;