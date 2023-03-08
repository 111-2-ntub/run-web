import { FetchUtil } from "../util/fetchUtil";

export  class ProposalR {
    static root = "proposal"
    static list(data) {
        return FetchUtil.getAPI(`${this.root}`,data)
    }
    
    static msg(data) {
        return FetchUtil.postAPI(`${this.root}/msg`, data)
    }
    static msgList(id,user_id) {
        return FetchUtil.getAPI(`${this.root}/${id}`,user_id)
    }
    static vote(data) {
        return FetchUtil.postAPI(`${this.root}/vote`, data)
    }

    static save(data) {
        return FetchUtil.postAPI(`${this.root}/save`, data)
    }

    static removeSave(data) {
        return FetchUtil.postAPI(`${this.root}/save/del`, data)
    }
    
    
    static rule() {
        return FetchUtil.getAPI(`${this.root}/rule`)
    }

    static report(data){
        return FetchUtil.postAPI(`${this.root}/report`,data)
    }

    static cond(){
        return FetchUtil.getAPI(`${this.root}/cond`)
    }
}