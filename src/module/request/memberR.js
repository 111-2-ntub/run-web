import { FetchUtil } from "../util/fetchUtil";

export class MemberR {
    static root = "user"
    static sign(data) {
        return FetchUtil.postAPI(`${this.root}/sign`, data)
    }

    static login(data) {
        return FetchUtil.postAPI(`${this.root}/login`, data)
    }

    static msg(u_id) {
        return FetchUtil.getAPI(`${this.root}/msg/${u_id}`)
    }

    static vote(u_id) {
        return FetchUtil.getAPI(`${this.root}/vote/${u_id}`)
    }

    static user(u_id) {
        return FetchUtil.getAPI(`${this.root}/${u_id}`)
    }

    static userEdit(data) {
        return FetchUtil.patchAPI(`${this.root}/`, data)
    }

    static pswEdit(data) {
        return FetchUtil.postAPI(`${this.root}/psw`, data)
    }

    static category(data) {
        return FetchUtil.postAPI(`${this.root}/category`, data)
    }

    static p_user(p_id) {
        return FetchUtil.getAPI(`${this.root}/p_user/${p_id}`)
    }



}