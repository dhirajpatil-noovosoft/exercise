import {makeObservable, observable, action} from "mobx";
class userStore{
    users:any[] = []
    constructor() {
        makeObservable(this, {
            users:observable,
            fetchUsers:action,
            setUsers:action
        })
    }
    async fetchUsers(){
        const response = await fetch('https://dummyjson.com/users?limit=0');
        let res = await response.json()
        this.setUsers(res.users)
    }
    setUsers(userData:any){
        this.users=userData
        console.log(this.users[0].id)
    }
}
const UserStore = new userStore();
export default UserStore;