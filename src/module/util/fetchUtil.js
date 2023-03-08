import { config } from "../../config"
import { ValueCheckerUtil } from "./valueCheckerUtil"

const BASE_URL = config.API_URL;
const GET = "GET";
const POST = "POST";
const DELETE = "DELETE";
const PATCH = "PATCH";
const PUT="PUT"
const APPLICATION_JSON = "application/json"

export class FetchUtil {
    static async getPromise(url, requestOptions, data) {
        if (data && typeof data === "object") {
            url += `?${this.objectToRequestParams(data)}`;
            console.log(url)
        }
        return await fetch(`${BASE_URL}${url}`, requestOptions)
            .then(this.responseToJSON)
            .then(this.handleResponse);
    }

    static async getAPI(url, data) {
        if (data) {
            const requestOptions = {
                method: GET,
                headers: {
                    "Content-Type": APPLICATION_JSON,
                    'Access-Control-Allow-Origin': '*',
                },

            }
            return await this.getPromise(url, requestOptions, data);

        } else {
            const requestOptions = {
                method: GET,
                headers: {
                    "Content-Type": APPLICATION_JSON,
                    'Access-Control-Allow-Origin': '*',
                },
            };
            return await this.getPromise(url, requestOptions, data);
        }

    }

    static async getHasTokenAPI(url, data) {
        const requestOptions = {
            method: GET,
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        };
        return await this.getPromise(url, requestOptions, data);
    }

    static async postAPI(url, data) {
        const requestOptions = {
            method: POST,
            headers: {
                "Content-Type": APPLICATION_JSON,
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(this.clearObject(data))
        };
        return await this.getPromise(url, requestOptions);
    }

    static async postHasTokenAPI(url, data) {
        const requestOptions = {
            method: POST,
            headers: {
                "Content-Type": APPLICATION_JSON,
                "Authorization": localStorage.getItem("token")
            },
            body: JSON.stringify(this.clearObject(data))

        };
        return await this.getPromise(url, requestOptions);
    }

    static async postFormDataAPI(url, data) {
        const requestOptions = {
            method: POST,
            headers: { "Authorization": localStorage.getItem("token") },
            body: this.clearFormData(data)
        };
        return await this.getPromise(url, requestOptions);
    }

    static async patchAPI(url, data) {
        const requestOptions = {
            method: PATCH,
            headers: {
                "Content-Type": APPLICATION_JSON,
                "Authorization": localStorage.getItem("token")
            },
            body: JSON.stringify(this.clearObject(data))
        };
        return await this.getPromise(url, requestOptions);
    }

    static async patchFormDataAPI(url, data) {
        const requestOptions = {
            method: PATCH,
            headers: {
                "Authorization": localStorage.getItem("token")
            },
            body: this.clearFormData(data)
        };
        return await this.getPromise(url, requestOptions);
    }

    static async deleteAPI(url) {
        const requestOptions = {
            method: DELETE
        };
        return await this.getPromise(url, requestOptions);
    }

    static async deleteHasDataAndTokenAPI(url) {
        const requestOptions = {
            method: DELETE,
            headers: {
                "Authorization": localStorage.getItem("token")
            },
        };
        return await this.getPromise(url, requestOptions);
    }

    static async putAPI(url,data) {
        const requestOptions = {
            method: PUT,
            headers: {
                "Content-Type": APPLICATION_JSON,
                // "Authorization": localStorage.getItem("token")
            },
            body: JSON.stringify(this.clearObject(data))
        };        
        return await this.getPromise(url, requestOptions);
    }

    static objectToRequestParams(object) {
        var paramsStringArray = [];
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                if (Array.isArray(object)) {
                    
                    object.forEach(item => {
                        paramsStringArray.push(encodeURIComponent(key) + "=" + encodeURIComponent(item));

                    })
                } else {
                    paramsStringArray.push(encodeURIComponent(key) + "=" + encodeURIComponent(object[key]));
                }

            }
        }
        return paramsStringArray.join("&");
    }


    static responseToJSON(response) {
        return response.json();
    }

    static handleResponse(response) {
        if (response) {
            return {
                "message": response.message,
                "data": response
            };
        } else {
            throw new Error(response.message);
        }
    }

    static clearObject(object) {
        Object.keys(object).forEach(key => {
            if (ValueCheckerUtil.isUndefinedOrNull(object[key]) || ValueCheckerUtil.isEmpty(object[key])) {
                delete object[key]
            }
        });
        return object;
    }

    static clearFormData(formData) {
        for (const key of formData.keys()) {
            const value = formData.get(key);
            if (ValueCheckerUtil.isUndefinedOrNull(value) || ValueCheckerUtil.isEmpty(value)) {
                formData.delete(key);
            }
        }
        return formData;
    }
}