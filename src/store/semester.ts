import {Interval, parse} from "date-fns";
import {StoreBase} from "./base";
import {Option} from "fp-ts/lib/Option";
import {Subscription} from "rxjs";
import {Ajax} from "../service/ajax";

export interface SemesterState extends Interval {
    id: number,
    name: string,
}

export class SemesterStore extends StoreBase {
    state: Map<number, SemesterState>;

    constructor(parent: Option<StoreBase>) {
        super(parent);
        this.state = new Map<number, SemesterState>();
    }

    public subscribe(callback: (_: Map<number, SemesterState>) => void): Subscription {
        return super.subscribe(callback)
    }

    public set(semester: SemesterState) {
        if (this.state.has(semester.id)) {
            Ajax.put('api/semester', semester)
                .subscribe((response) => {
                    this.state.set(response.response.id, {
                        ...response.response,
                        start: parse(response.response.start.slice(0, 10), "yyyy-MM-dd", new Date()),
                        end: parse(response.response.end.slice(0, 10), "yyyy-MM-dd", new Date()),
                    });
                    this.updated();
                })
        } else {
            Ajax.post('api/semester', semester)
                .subscribe((response) => {
                    this.state.set(response.response.id, {
                        ...response.response,
                        start: parse(response.response.start.slice(0, 10), "yyyy-MM-dd", new Date()),
                        end: parse(response.response.end.slice(0, 10), "yyyy-MM-dd", new Date()),
                    });
                    this.updated();
                })
        }
    }

    public fetchAll() {
        Ajax.get('api/semesters')
            .subscribe(response => {
                response.response.forEach((it: {
                        id: number,
                        name: string,
                        start: string,
                        end: string
                    }) => {
                        this.state.set(it.id, {
                            ...it,
                            start: parse(it.start.slice(0, 10), "yyyy-MM-dd", new Date()),
                            end: parse(it.end.slice(0, 10), "yyyy-MM-dd", new Date()),
                        })
                    }
                );
                this.updated();
            })
    }

    public fetch(id: number) {
        Ajax.get(`api/semester?id=${id}`)
            .subscribe(response => {
                this.state.set(response.response.id, {
                    ...response.response,
                    start: parse(response.response.start.slice(0, 10), "yyyy-MM-dd", new Date()),
                    end: parse(response.response.end.slice(0, 10), "yyyy-MM-dd", new Date()),
                });
                this.updated();
            })
    }
}
