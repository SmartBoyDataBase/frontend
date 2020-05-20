import {Ajax} from "./ajax";
import {map} from "rxjs/operators";

export function login(username: string, password: string) {
    Ajax.post('auth/login', {
        username, password
    }).pipe(map(it => it.response.token))
        .subscribe(token => {
            Ajax.setToken(token);
            const userInfo: { sub: number, role: number } = JSON.parse(atob(token.split('.')[1]));
        })
}
