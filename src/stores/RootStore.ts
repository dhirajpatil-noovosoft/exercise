import UserStore from "./UserStore";
import CartStore from "./cartStore";
import DataStore from "./dataStore";
import StatusStore from "./StatusStore";
class RootStores {
    userStore = UserStore;
    cartStore = CartStore;
    dataStore = DataStore;
    statusStore = StatusStore;
}
const RootStore = new RootStores();
export default RootStore;
// fine