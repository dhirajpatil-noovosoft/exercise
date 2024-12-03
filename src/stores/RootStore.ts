import {makeObservable, observable, action} from "mobx";
import UserStore from "./UserStore";
import userStore from "./UserStore";
import CartStore from "./cartStore";
// import updateCart from "../utils/updateCart"; // uncomment this if u want updation logs on cart update
interface Type
{ id: number; title: string; price: number; thumbnail: string; description:string; category:string }
class RootStores {
    userStore:typeof userStore = UserStore;
    cartStore = CartStore;
    error: any = null;
    data: Type[] = [];
    newData: Type[] = [];
    loading: boolean = false;
    constructor() {
        makeObservable(this, {
            data: observable,
            newData: observable,
            loading: observable,
            error: observable,
            setData: action,
            setNewData: action,
            setLoading: action,
            setError: action
        });
        this.userStore = UserStore;
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
            // await this.setParticularCart(this.userStore.selectedUser);
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
}
const RootStore = new RootStores();
export default RootStore;
// fine