import {makeObservable, observable, action} from "mobx";
import StatusStore from "./StatusStore";
import CartStore from "./cartStore";
import UserStore from "./UserStore";
interface Type
{ id: number; title: string; price: number; thumbnail: string; description:string; category:string }
class dataStore {
    data: Type[] = [];
    newData: Type[] = [];
    statusStore = StatusStore
    cartStore = CartStore
    userStore = UserStore
    constructor() {
        makeObservable(this, {
            data: observable,
            newData: observable,
            setData: action,
            setNewData: action,
        })
    }
    // Set the data to the store
    setData(data: Type[]) {
        this.data = data;
    }

    // Set the new filtered data
    setNewData(newData:  Type[]) {
        this.newData = newData;
    }
    // Fetch data from the API
    async fetchData(url: string) {
        this.statusStore.setLoading(true);
        try {
            const response = await fetch(url);
            const result = await response.json();
            const res = result.products
            this.setNewData(res || result); // Assuming 'products' is the key in the response
            this.setData(res || result);
            await this.cartStore.setParticularCart(this.userStore.selectedUser);
        } catch (err) {
            this.statusStore.setError(err);
        } finally {
            this.statusStore.setLoading(false);
        }
    }
}
const DataStore = new dataStore();
export default DataStore