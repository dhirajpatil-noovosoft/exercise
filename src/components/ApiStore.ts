import {makeObservable, observable, action} from "mobx";
import GetCart from "./GetCart";
import UserStore from "./UserStore";
class ApiStores {
    data: any[] = [];
    newData: any[] = [];
    loading: boolean = false;
    error: any = null;
    cartMap: Map<string, Array<{ id: number; title: string; price: number; thumbnail: string; quantity: number }>> = new Map();
    cart: { id: number; title: string; price: number; thumbnail: string; quantity: number }[][] = [];
    userid : string  = "1";
    userName:string = '';
    userStore = UserStore;
    selectedUser:string = "1"
    constructor() {
        makeObservable(this, {
            data: observable,
            newData: observable,
            loading: observable,
            error: observable,
            cart: observable,
            setData: action,
            setNewData: action,
            setLoading: action,
            setError: action,
            addToCart: action,
            removeFromCart: action,
            updateCartQuantity: action,
            updateCart:action,
            setCart:action,
            clearCart: action,
            userid:observable,
            setUserId:action,
            selectedUser:observable,
            setSelectedUser:action,
            cartMap:observable,
            setCartMap:action,
            getUser:action,
            userName:observable
        });
        this.userStore = UserStore;
        this.cartMap = new Map();
    }
    setCartMap(uid:string, cartData:any){
        this.cartMap.set(uid, cartData)
    }
    setSelectedUser = async(User: string) => {
        this.selectedUser = User;
        this.setUserId(this.selectedUser)
        await this.setParticularCart(User)
    };

    setUserId(id:string){
        this.userid = id
    }
    // Fetch data from the API
    async fetchData(url: string) {
        this.setLoading(true);
        try {
            const response = await fetch(url);
            const result = await response.json();
            const res = await result.products
            this.setNewData(res || result); // Assuming 'products' is the key in the response
            this.setData(res || result);
            await this.setParticularCart(this.userid);
        } catch (err) {
            this.setError(err);
        } finally {
            this.setLoading(false);
        }
    }
    async setParticularCart(uid:string){
        let currCartId = await GetCart(uid)
        if(this.cartMap.has(uid))
            return
        else {
            let currCartId = await GetCart(uid)
            this.setCartMap(uid, currCartId)
        }
    }
    // Set the data to the store
    setData(data: any[]) {
        this.data = data;
    }
    setCart(id:any, data:any[]){
        this.cart[id] = data
    }

    // Set the new filtered data
    setNewData(newData: any[]) {
        this.newData = newData;
    }

    // Set loading state
    setLoading(loading: boolean) {
        this.loading = loading;
    }

    // Set error state
    setError(error: any) {
        this.error = error;
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
    async getUser(){
        const response = await fetch(`https://dummyjson.com/users/${this.userid}`)
        const res = await response.json()
        this.userName = res.firstName
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

    // Clear all items from the cart
    clearCart() {
        this.cart = [];
    }
}

const ApiStore = new ApiStores();
export default ApiStore;
// fine