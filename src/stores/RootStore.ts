import {makeObservable, observable, action} from "mobx";
import GetCart from "../utils/GetCart";
import UserStore from "./UserStore";
import userStore from "./UserStore";
import updateCart from "../utils/updateCart";
interface Type
{ id: number; title: string; price: number; thumbnail: string; description:string; category:string }
interface cartType{ id: number; title: string; price: number; thumbnail: string; quantity: number; category:string }
class RootStores {
    error: any = null;
    data: Type[] = [];
    newData: Type[] = [];
    loading: boolean = false;
    userid : string  = "1";
    userName:string = '';
    userStore:typeof userStore = UserStore;
    selectedUser:string = "1"
    cartMap: Map<string, Array<cartType>> = new Map();

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
    setData(data: Type[]) {
        this.data = data;
    }

    // Set the new filtered data
    setNewData(newData:  Type[]) {
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
            const res = result.products
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
    async setCartMap(uid:string, cartData:Array<cartType>){
        this.cartMap.set(uid, cartData)
        await updateCart(Number(this.userid), cartData)
    }
    async setParticularCart(uid:string){
        if(this.cartMap.has(uid))
            return
        else {
            let currCartId = await GetCart(uid)
            await this.setCartMap(uid, currCartId)
        }
    }
    // Add product to cart
    async addToCart(product: Type) {
        if(!this.cartMap.has(this.userid)){
            await this.setCartMap(this.userid, [])
        }
        let existingProduct:number = -1
        let array:Array<cartType> = []
        let existingCartItems:Array<cartType> = this.cartMap.get(this.userid) || []
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
        let newCartItems:Array<cartType> = []
        const existingCartItems:Array<cartType> = this.cartMap.get(this.userid) || []
        for(let i = 0 ; i < existingCartItems?.length ; i++)
            if(existingCartItems[i].id !== productId)
                newCartItems.push(existingCartItems[i])
        await this.setCartMap(this.userid, newCartItems )
    }

    // Update product quantity in cart
    async updateCartQuantity(productId: number, change: number) {
        const existsingCartItems:Array<cartType> = this.cartMap.get(this.userid) || [];
        let newItemCart:Array<cartType> = []
        for(let i = 0 ; i < existsingCartItems?.length ; i++) {
            if (existsingCartItems[i].id === productId) {
                existsingCartItems[i].quantity += change
            }
            if(existsingCartItems[i].quantity !== 0)
                newItemCart.push(existsingCartItems[i])
        }
        await this.setCartMap(this.userid, newItemCart)
    }
    setUserName(name:string)
    {
        this.userName = name
    }
    async getUser(){
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/${this.userid}`);
        const res = await response.json()
        this.setUserName(res.firstName)
    }
}
const RootStore = new RootStores();
export default RootStore;
// fine