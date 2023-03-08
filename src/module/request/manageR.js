import { FetchUtil } from "../util/fetchUtil";

export class ManageR {
    static root = "manage"
    

    static report(data){
        return FetchUtil.getAPI(`${this.root}/report`, data)
    }
    static check(data){
        return FetchUtil.postAPI(`${this.root}/report`, data)
    }

    static user(){
        return FetchUtil.getAPI(`${this.root}/user`)
    }
    static identity(data){
        return FetchUtil.postAPI(`${this.root}/identity`,data)
    }

}