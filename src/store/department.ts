import {StoreBase} from "./base";
import {Subscription} from "rxjs";
import {Ajax} from "../service/ajax";
import {Option} from "fp-ts/lib/Option";

export interface DepartmentState {
    id: number,
    name: string,
    admin: number
}

export class DepartmentStore extends StoreBase {
    state: Map<number, DepartmentState>;

    constructor(parent: Option<StoreBase>) {
        super(parent);
        this.state = new Map<number, DepartmentState>();
    }

    public subscribe(callback: (_: Map<number, DepartmentState>) => void): Subscription {
        return super.subscribe(callback)
    }

    public set(department: DepartmentState) {
        if (this.state.has(department.id)) {
            Ajax.put('api/college', department)
                .subscribe((response) => {
                    this.state.set(response.response.id, response.response);
                    this.updated();
                })
        } else {
            Ajax.post('api/college', department)
                .subscribe((response) => {
                    this.state.set(response.response.id, response.response);
                    this.updated();
                })
        }
    }

    public fetchAll() {
        Ajax.get('api/colleges')
            .subscribe(response => {
                response.response.forEach((it: DepartmentState) =>
                    this.state.set(it.id, it)
                );
                this.updated();
            })
    }

    public delete(department: DepartmentState) {
        Ajax.delete(`api/college?id=${department.id}`)
            .subscribe(response => {
                this.state.delete(department.id);
                this.updated();
            })
    }
}
