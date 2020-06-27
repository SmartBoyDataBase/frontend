import {StoreBase} from "./base";
import {Option} from "fp-ts/lib/Option";
import {Subscription} from "rxjs";
import {Ajax} from "../service/ajax";
import {parse} from "date-fns";

export interface StudentState {
    id: number,
    college_id: number,
    name: string,
    birthday: Date,
    entrance: Date,
    sex: 'male' | 'female'
}

export class StudentStore extends StoreBase {
    state: Map<number, StudentState>;

    constructor(parent: Option<StoreBase>) {
        super(parent);
        this.state = new Map<number, StudentState>();
    }

    public subscribe(callback: (_: Map<number, StudentState>) => void): Subscription {
        return super.subscribe(callback)
    }

    public set(student: StudentState) {
        if (this.state.has(student.id)) {
            Ajax.put('api/student', student)
                .subscribe((response) => {
                    this.state.set(response.response.id, {
                        ...response.response,
                        birthday: parse(response.response.birthday.slice(0, 10), 'yyyy-MM-dd', new Date()),
                        entrance: parse(response.response.birthday.slice(0, 10), 'yyyy-MM-dd', new Date())
                    });
                    this.updated();
                })
        } else {
            Ajax.post('api/student', student)
                .subscribe((response) => {
                    this.state.set(response.response.id, {
                        ...response.response,
                        birthday: parse(response.response.birthday.slice(0, 10), 'yyyy-MM-dd', new Date()),
                        entrance: parse(response.response.entrance.slice(0, 10), 'yyyy-MM-dd', new Date())
                    });
                    this.updated();
                })
        }
    }

    public fetchAll() {
        Ajax.get('api/students')
            .subscribe(response => {
                response.response.forEach((it: {
                        id: number,
                        college_id: number,
                        name: string,
                        birthday: string,
                        entrance: string,
                        sex: 'male' | 'female'
                    }) => {
                        this.state.set(it.id, {
                            ...it,
                            birthday: parse(it.birthday.slice(0, 10), 'yyyy-MM-dd', new Date()),
                            entrance: parse(it.entrance.slice(0, 10), 'yyyy-MM-dd', new Date())
                        })
                    }
                );
                this.updated();
            })
    }

    public delete(student: StudentState) {
        Ajax.delete(`api/student?id=${student.id}`)
            .subscribe(() => {
                this.state.delete(student.id);
                this.updated();
            })
    }
}
