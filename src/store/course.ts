import {StoreBase} from "./base";
import {Option} from "fp-ts/lib/Option";
import {Subscription} from "rxjs";
import {Ajax} from "../service/ajax";

export interface CourseState {
    id: number,
    name: string,
    credit: number,
    college_id: number
}

export class CourseStore extends StoreBase {
    state: Map<number, CourseState>;

    constructor(parent: Option<StoreBase>) {
        super(parent);
        this.state = new Map<number, CourseState>();
    }

    public subscribe(callback: (_: Map<number, CourseState>) => void): Subscription {
        return super.subscribe(callback)
    }

    public set(course: CourseState) {
        if (this.state.has(course.id)) {
            Ajax.put('api/course', course)
                .subscribe((response) => {
                    this.state.set(response.response.id, response.response);
                    this.updated();
                })
        } else {
            Ajax.post('api/course', course)
                .subscribe((response) => {
                    this.state.set(response.response.id, response.response);
                    this.updated();
                })
        }
    }

    public fetchAll() {
        Ajax.get('api/courses')
            .subscribe(response => {
                response.response.forEach((it: CourseState) => {
                        this.state.set(it.id, it)
                    }
                );
                this.updated();
            })
    }

    public fetch(id: number) {
        Ajax.get(`api/course?id=${id}`)
            .subscribe(response => {
                this.state.set(response.response.id, response.response);
                this.updated();
            });
    }
}
