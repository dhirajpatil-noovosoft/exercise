import {makeObservable, observable, action} from "mobx";
import GetCart from "./GetCart";
import UserStore from "./UserStore";
class ApiStores {
    data: any[] = [];
    newData: any[] = [];
    loading: boolean = false;
    error: any = null;
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
            updateWholeCart:action,
            setCart:action,
            clearCart: action,
            userid:observable,
            setUserId:action,
            selectedUser:observable,
            setSelectedUser:action
        });
        this.userStore = UserStore;
    }

    setSelectedUser = async(User: string) => {
        this.selectedUser = User;
        this.setUserId(this.selectedUser)
        await this.setParticularCart(Number(User))
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
    async setParticularCart(uid:any){
        let currCartId = await GetCart(uid)
        if(currCartId === -1) {
            this.setCart(uid, [])
        }
        if(this.cart[uid] !== undefined)
            return
        else{
            const cartResult = await fetch(`https://dummyjson.com/carts/${currCartId}`)
            const jsonCart = await cartResult.json()
            const jsonProducts = await jsonCart.products
            const cartData = jsonProducts.map((item:any) =>
            {
                return {id:item["id"],title:item["title"], price:item["price"],thumbnail:item["thumbnail"], quantity:item["quantity"]};
            })
            this.setCart(uid, cartData);
        }
    }
    // async setEachcart(){
    //     await this.userStore.fetchUsers()
    //     console.log("total users we have : ", this.userStore.users.length)
    //     for(let i = 0 ; i < this.userStore.users.length ; i++){
    //         console.log("setting for ", this.userStore.users[i]["id"])
    //         let currCartId = await GetCart(this.userStore.users[i]["id"])
    //         if(currCartId === -1) {
    //             this.setCart(this.userStore.users[i]["id"], [])
    //         }
    //         else{
    //             const cartResult = await fetch(`https://dummyjson.com/carts/${currCartId}`)
    //             const jsonCart = await cartResult.json()
    //             const jsonProducts = await jsonCart.products
    //             const cartData = jsonProducts.map((item:any) =>
    //             {
    //                 return {id:item["id"],title:item["title"], price:item["price"],thumbnail:item["thumbnail"], quantity:item["quantity"]};
    //             })
    //             this.setCart(this.userStore.users[i]["id"], cartData);
    //         }
    //     }
    // }

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
    async updateWholeCart(){
        const products = []
        for(let i = 0 ; i < this.cart[Number(this.userid)].length ; i++)
            products.push({id :this.cart[Number(this.userid)][i].id,quantity:this.cart[Number(this.userid)][i].quantity })
        const result: any = await this.updateCart(this.userid, products)
        this.setCart(Number(this.userid) ,result.products || result)
    }
    // Add product to cart
    addToCart(product: { id: number; title: string; price: number; thumbnail: string }) {
        const existingProduct = this.cart[Number(this.userid)]?.find((item) => item.id === product.id);
        if (existingProduct) {
            existingProduct.quantity += 1; // Increment quantity if already in the cart
        } else {
            this.cart.push()
            const newItem = [this.cart[Number(this.userid)], { ...product, quantity: 1 }]
            this.setCart(Number(this.userid) , newItem)
        }
    }

    // Remove product from cart
    async removeFromCart(productId: number) {
        this.cart[Number(this.userid)] = this.cart[Number(this.userid)].filter((item) => item.id !== productId);
        await this.updateWholeCart();
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
    async updateCartQuantity(productId: number, change: number) {
        await this.updateWholeCart();
        const product = this.cart[Number(this.userid)].find((item) => item.id === productId);
        if (product) {
            product.quantity += change;
            if (product.quantity <= 0) {
                await this.removeFromCart(productId); // Remove product if quantity is 0
            }
        }
        await this.updateWholeCart();
    }

    // Clear all items from the cart
    clearCart() {
        this.cart = [];
    }
}

const ApiStore = new ApiStores();
export default ApiStore;
// fine