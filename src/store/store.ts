import {some} from "fp-ts/lib/Option";
import {UserStore} from "./user";
import {StoreBase} from "./base";
import {DepartmentStore} from "./department";

class Store extends StoreBase {
    public state: {
        user: UserStore,
        departments: DepartmentStore
    };

    constructor() {
        super();
        this.state = {
            user: new UserStore(some(this)),
            departments: new DepartmentStore(some(this))
        }
    }
}

export const store = new Store();
