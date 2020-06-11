import {ajax} from 'rxjs/ajax';

const baseUrl = "http://0.0.0.0:30000/";
export const Ajax = {
    token: "",
    setToken(token: string) {
        localStorage.setItem("token", token);
        this.token = token;
    },
    get(url: string) {
        return ajax.get(baseUrl + url, {
            "Authorization": "Bearer " + this.token
        });
    },
    post(url: string, content: Object) {
        return ajax.post(baseUrl + url, JSON.stringify(content),
            {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.token
            });
    },
    put(url: string, content: Object) {
        return ajax.put(baseUrl + url, JSON.stringify(content),
            {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.token
            });
    },
    delete(url: string) {
        return ajax.delete(baseUrl + url, {
            "Authorization": "Bearer " + this.token
        });
    }
};
