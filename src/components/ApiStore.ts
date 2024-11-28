import {makeObservable, observable, action} from "mobx";
import GetCart from "./GetCart";
import UserStore from "./UserStore";
import userStore from "./UserStore";
import updateCart from "./updateCart";
class ApiStores {
    error: any = null;
    data: { id: number; title: string; price: number; thumbnail: string; description:string }[] = [];
    newData: { id: number; title: string; price: number; thumbnail: string; description:string }[] = [];
    loading: boolean = false;
    userid : string  = "1";
    userName:string = '';
    userStore:typeof userStore = UserStore;
    selectedUser:string = "1"
    cartMap: Map<string, Array<{ id: number; title: string; price: number; thumbnail: string; quantity: number }>> = new Map();

    constructor() {
        makeObservable(this, {
            data: observable,
            newData: observable,
            loading: observable,
            error: observable,
            setData: action,
            setNewData: action,
            setLoading: action,
            setError: action,
            userid:observable,
            getUser:action,
            userName:observable,
            setUserId:action,
            selectedUser:observable,
            setSelectedUser:action,
            cartMap:observable,
            setCartMap:action,
            addToCart: action,
            removeFromCart: action,
            updateCartQuantity: action,
            setUserName:action
        });
        this.userStore = UserStore;
        this.cartMap = new Map();
    }

    setSelectedUser = async(User: string) => {
        this.selectedUser = User;
        this.setUserId(this.selectedUser)
        await this.setParticularCart(User)
    };

    setUserId(id:string){
        this.userid = id
    }
    // Set the data to the store
    setData(data: { id: number; title: string; price: number; thumbnail: string; description:string }[]) {
        this.data = data;
    }

    // Set the new filtered data
    setNewData(newData: { id: number; title: string; price: number; thumbnail: string; description:string }[]) {
        this.newData = newData;
    }

    // Set loading state
    setLoading(loading: boolean) {
        this.loading = loading;
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
    // Set error state
    setError(error: any) {
        this.error = error;
    }
    async setCartMap(uid:string, cartData:Array<{ id: number; title: string; price: number; thumbnail: string; quantity: number }>){
        this.cartMap.set(uid, cartData)
        await updateCart(Number(this.userid), cartData)
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
        let array:Array<{ id: number; title: string; price: number; thumbnail: string; quantity: number }> = []
        let existingCartItems:Array<{ id: number; title: string; price: number; thumbnail: string; quantity: number }> = this.cartMap.get(this.userid) || []
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
        let newCartItems:Array<{ id: number; title: string; price: number; thumbnail: string; quantity: number }> = []
        const existingCartItems:Array<{ id: number; title: string; price: number; thumbnail: string; quantity: number }> = this.cartMap.get(this.userid) || []
        for(let i = 0 ; i < existingCartItems?.length ; i++)
            if(existingCartItems[i].id !== productId)
                newCartItems.push(existingCartItems[i])
        this.setCartMap(this.userid, newCartItems )
    }

    // Update product quantity in cart
    updateCartQuantity(productId: number, change: number) {
        const existsingCartItems:Array<{ id: number; title: string; price: number; thumbnail: string; quantity: number }> = this.cartMap.get(this.userid) || [];
        let newItemCart:Array<{ id: number; title: string; price: number; thumbnail: string; quantity: number }> = []
        for(let i = 0 ; i < existsingCartItems?.length ; i++) {
            if (existsingCartItems[i].id === productId) {
                existsingCartItems[i].quantity += change
            }
            if(existsingCartItems[i].quantity !== 0)
                newItemCart.push(existsingCartItems[i])
        }
        this.setCartMap(this.userid, newItemCart)
    }
    setUserName(name:string)
    {
        this.userName = name
    }
    async getUser(){
        const response = await fetch(`https://dummyjson.com/users/${this.userid}`)
        const res = await response.json()
        this.setUserName(res.firstName)
    }
}
const ApiStore = new ApiStores();
export default ApiStore;
// fine