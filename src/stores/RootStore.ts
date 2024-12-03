import {makeObservable, observable, action} from "mobx";
import GetCart from "../utils/GetCart";
import UserStore from "./UserStore";
import userStore from "./UserStore";
// import updateCart from "../utils/updateCart"; // uncomment this if u want updation logs on cart update
interface Type
{ id: number; title: string; price: number; thumbnail: string; description:string; category:string }
interface cartType{ id: number; title: string; price: number; thumbnail: string; quantity: number; category:string }
class RootStores {
    error: any = null;
    data: Type[] = [];
    newData: Type[] = [];
    loading: boolean = false;
    selectedUser : string  = "";
    userName:string = '';
    userStore:typeof userStore = UserStore;
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
            getUser:action,
            userName:observable,
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
        this.setselectedUser(this.selectedUser)
        await this.setParticularCart(User)
    };

    setselectedUser(id:string){
        this.selectedUser = id
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
            await this.setParticularCart(this.selectedUser);
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
        // await updateCart(Number(this.selectedUser), cartData) // uncomment this if u want cart updation requests
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
        if(!this.cartMap.has(this.selectedUser)){
            await this.setCartMap(this.selectedUser, [])
        }
        let existingCartItems:Array<cartType> = this.cartMap.get(this.selectedUser) || []
        let existingProduct:number = -1
        const array = existingCartItems.map((item, index) => {
            if (item.id === product.id) {
                item.quantity += 1;
                existingProduct = index;
            }
            return item;
        });
        if (existingProduct === -1) {
            array.push({...product, quantity:1});
        }
        await this.setCartMap(this.selectedUser, array)
    }
    // to remove from cart
    async removeFromCart(productId: number) {
        const existingCartItems: Array<cartType> = this.cartMap.get(this.selectedUser) || [];
        const newCartItems = existingCartItems.filter(item => item.id !== productId);
        await this.setCartMap(this.selectedUser, newCartItems);
    }

    // Update product quantity in cart
    async updateCartQuantity(productId: number, change: number) {
        const existingCartItems: Array<cartType> = this.cartMap.get(this.selectedUser) || [];
        const newCartItems = existingCartItems
            .map(item => {
                if (item.id === productId) {
                    item.quantity += change;
                }
                return item;
            })
            .filter(item => item.quantity !== 0);
        await this.setCartMap(this.selectedUser, newCartItems);
    }

    setUserName(name:string)
    {
        this.userName = name
    }
    async getUser(){
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/${this.selectedUser}`);
        const res = await response.json()
        this.setUserName(res.firstName)
    }
}
const RootStore = new RootStores();
export default RootStore;
// fine