import {makeObservable, observable, action} from "mobx";
class statusStore{
    error: any = null;
    loading: boolean = false;
    constructor() {
        makeObservable(this,
        {
            loading: observable,
            error: observable,
            setLoading: action,
            setError: action
        })
    }
    // Set loading state 
    setLoading(loading: boolean) {
        this.loading = loading;
    }

    // Set error state
    setError(error: any) {
        this.error = error;
    }
}
const StatusStore = new statusStore();
export default StatusStore