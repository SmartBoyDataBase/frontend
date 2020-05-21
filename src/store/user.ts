import * as O from "fp-ts/lib/Option";
import {Option} from "fp-ts/lib/Option";
import {Ajax} from "../service/ajax";
import {map} from "rxjs/operators";
import {StoreBase} from "./base";
import {Subscription} from "rxjs";

type Role = 'superuser' | 'collegeAdmin' | 'teacher' | 'student';

const roleIdRoleMap = new Map([
    [1, 'superuser'],
    [2, 'collegeAdmin'],
    [3, 'teacher'],
    [4, 'student'],
])

interface UserState {
    id: number,
    username: string,
    role: Role
}

export class UserStore extends StoreBase {
    state: O.Option<UserState>;

    constructor(parent: Option<StoreBase>) {
        super(parent);
        this.state = O.none;
        if (localStorage.getItem("token")) {
            const token = localStorage.getItem("token")!;
            const userInfo = JSON.parse(atob(token.split('.')[1]));
            this.state = O.some({
                id: userInfo.sub,
                username: "superuser",
                role: roleIdRoleMap.get(userInfo.role)! as Role
            });
            this.updated()
        }
    }

    public subscribe(callback: (_: O.Option<UserState>) => void): Subscription {
        return super.subscribe(callback)
    }

    public login(username: string, password: string) {
        Ajax.post('auth/login', {
            username, password
        }).pipe(
            map(it => it.response.token)
        ).subscribe(token => {
            localStorage.setItem("token", token);
            const userInfo = JSON.parse(atob(token.split('.')[1]));
            this.state = O.some({
                id: userInfo.sub,
                username,
                role: roleIdRoleMap.get(userInfo.role)! as Role
            });
            this.updated()
        });
    }
}
