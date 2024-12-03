import {action, makeObservable, observable} from "mobx";
import UserStore from "./UserStore";
import ApiStore from "./apiStore";
interface Type
{ id: number; title: string; price: number; thumbnail: string; description:string; category:string }
interface cartType{ id: number; title: string; price: number; thumbnail: string; quantity: number; category:string }
class cartStore{
    userStore = UserStore
    apiStore = ApiStore
    cartMap: Map<string, Array<cartType>> = new Map();
    constructor() {
        makeObservable(this, {
            cartMap:observable,
            setCartMap:action,
            addToCart: action,
            removeFromCart: action,
            updateCartQuantity: action
        })
        this.cartMap = new Map();
    }
    async setCartMap(uid:string, cartData:Array<cartType>){
        this.cartMap.set(uid, cartData)
        // await updateCart(Number(this.userStore.selectedUser), cartData) // uncomment this if u want cart updation requests
    }
    async setParticularCart(uid:string){
        if(this.cartMap.has(uid))
            return
        else {
            let currCartId = await this.apiStore.GetCart(uid)
            await this.setCartMap(uid, currCartId)
        }
    }
    // Add product to cart
    async addToCart(product: Type) {
        if(!this.cartMap.has(this.userStore.selectedUser)){
            await this.setCartMap(this.userStore.selectedUser, [])
        }
        let existingCartItems:Array<cartType> = this.cartMap.get(this.userStore.selectedUser) || []
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
        await this.setCartMap(this.userStore.selectedUser, array)
    }
    // to remove from cart
    async removeFromCart(productId: number) {
        const existingCartItems: Array<cartType> = this.cartMap.get(this.userStore.selectedUser) || [];
        const newCartItems = existingCartItems.filter(item => item.id !== productId);
        await this.setCartMap(this.userStore.selectedUser, newCartItems);
    }

    // Update product quantity in cart
    async updateCartQuantity(productId: number, change: number) {
        const existingCartItems: Array<cartType> = this.cartMap.get(this.userStore.selectedUser) || [];
        const newCartItems = existingCartItems
            .map(item => {
                if (item.id === productId) {
                    item.quantity += change;
                }
                return item;
            })
            .filter(item => item.quantity !== 0);
        await this.setCartMap(this.userStore.selectedUser, newCartItems);
    }
}
const CartStore = new cartStore()
export default CartStore