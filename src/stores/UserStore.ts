import {makeObservable, observable, action} from "mobx";
class userStore{
    users:Array< {id:string, firstName:string}> = []
    selectedUser : string  = "";
    userID:string = '';
    constructor() {
        makeObservable(this, {
            users:observable,
            fetchUsers:action,
            setUsers:action,
            userID:observable,
            selectedUser:observable,
            setSelectedUser:action,
        })
    }
    setSelectedUser = async(User: string) => {
        this.selectedUser = User;
        this.userID = User;
        // await this.apiStore.setParticularCart(User)
    };
    async fetchUsers(){
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users?limit=0`);
        let res = await response.json()
        this.setUsers(res.users)
    }
    setUsers(userData:Array< {id:string, firstName:string}>){
        this.users=userData
    }

    async getUser(){
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/${this.selectedUser}`);
        const res = await response.json()
        await this.setSelectedUser(res.firstName)
    }
}
const UserStore = new userStore();
export default UserStore;