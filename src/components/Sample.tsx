import React, {Component}  from "react";
import UserStore from "./UserStore";
import { observer } from "mobx-react";
import {action, makeObservable, observable} from "mobx";
@observer
class Sample extends Component{
    userStore = UserStore;
    loading:boolean = true
    user: { slug: string; name: string; url: string }[] = [];
    selectedUser:string = "1";
    constructor() {
        super(1);
        makeObservable(this,
            {
                selectedUser:observable,
                handleUser:action
            })
        this.handleUser = this.handleUser.bind(this);
    }
    run(e:string)
    {
        console.log(e)
    }
    handleUser(event:React.ChangeEvent<HTMLSelectElement>){
        this.selectedUser = event.target.value
        console.log("userselected : ", this.selectedUser)
    }
    setLoading(){
        this.loading =false
    }
    async componentDidMount() {
        this.userStore = UserStore
        await this.userStore.fetchUsers()
        console.log("mounted")
        console.log(Object.keys(this.userStore.users))
        this.loading = false
        this.setLoading()
        console.log("user",  this.selectedUser)
        this.forceUpdate()
        console.log("userssss",  this.selectedUser)

    }

    render() {
        {console.log(this.loading)}
        return <>
            {
                (!this.loading) ?
                    <>
                        <select value={this.selectedUser}
                                onChange={this.handleUser}
                        >
                            {
                                this.userStore.users.map((user: any) => {
                                    return (
                                        <option key={user.id} value={user.firstName}>{user.firstName}</option>
                                    )
                                })
                            }
                        </select>
                        </> : "dhiraj"
                        }
                    </>


            }
}
export default Sample;