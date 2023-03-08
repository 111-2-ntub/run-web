import { FetchUtil } from "../util/fetchUtil";

export class HomeR {
    static root = "home"
    static home(){
        return FetchUtil.getAPI(`${this.root}/`)
    }

}