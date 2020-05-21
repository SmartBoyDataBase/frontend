import {StoreBase} from "./base";
import {Option} from "fp-ts/lib/Option";
import {Subscription} from "rxjs";
import {Ajax} from "../service/ajax";
import {parse} from "date-fns";

export interface TeacherState {
    id: number,
    name: string,
    birthday: Date,
    sex: 'male' | 'female'
}

export class TeacherStore extends StoreBase {
    state: Map<number, TeacherState>;

    constructor(parent: Option<StoreBase>) {
        super(parent);
        this.state = new Map<number, TeacherState>();
    }

    public subscribe(callback: (_: Map<number, TeacherState>) => void): Subscription {
        return super.subscribe(callback)
    }

    public set(teacher: TeacherState) {
        if (this.state.has(teacher.id)) {
            Ajax.put('api/teacher', teacher)
                .subscribe((response) => {
                    this.state.set(response.response.id, {
                        ...response.response,
                        birthday: parse(response.response.birthday.slice(0, 10), 'yyyy-MM-dd', new Date())
                    });
                    this.updated();
                })
        } else {
            Ajax.post('api/teacher', teacher)
                .subscribe((response) => {
                    this.state.set(response.response.id, {
                        ...response.response,
                        birthday: parse(response.response.birthday.slice(0, 10), 'yyyy-MM-dd', new Date())
                    });
                    this.updated();
                })
        }
    }

    public fetchAll() {
        Ajax.get('api/teachers')
            .subscribe(response => {
                response.response.forEach((it: {
                        id: number,
                        name: string,
                        birthday: string,
                        sex: 'male' | 'female'
                    }) => {
                        this.state.set(it.id, {
                            ...it,
                            birthday: parse(it.birthday.slice(0, 10), 'yyyy-MM-dd', new Date())
                        })
                    }
                );
                this.updated();
            })
    }
}
