import {makeObservable, observable, action} from "mobx";
class userStore{
    users:Array< {id:string, firstName:string}> = []
    constructor() {
        makeObservable(this, {
            users:observable,
            fetchUsers:action,
            setUsers:action
        })
    }

    async fetchUsers(){
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users?limit=0`);
        let res = await response.json()
        this.setUsers(res.users)
    }
    setUsers(userData:Array< {id:string, firstName:string}>){
        this.users=userData
    }
}
const UserStore = new userStore();
export default UserStore;