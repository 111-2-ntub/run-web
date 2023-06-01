import { FetchUtil } from "../util/fetchUtil";

export  class PoliticianR {
    static root = "politician"

    static list(data) {
        return FetchUtil.getAPI(`${this.root}/`)
    }

    static getList(data) {
        return FetchUtil.getAPI(`${this.root}/list`, data)
    }

    static detail(id) {
        return FetchUtil.getAPI(`${this.root}/d/${id}`)
    }

    static area() {
        return FetchUtil.getAPI(`${this.root}/area`)
    }
    static name() {
        return FetchUtil.getAPI(`${this.root}/name`)
    }
    static term() {
        return FetchUtil.getAPI(`${this.root}/term`)
    }

    static cond() {
        return FetchUtil.getAPI(`${this.root}/cond`)
    }

    static score(data){
        return FetchUtil.postAPI(`${this.root}/score`,data)
    }

  

}