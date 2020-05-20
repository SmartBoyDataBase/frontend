import {Subject, Subscription} from "rxjs";
import {map, none, Option} from "fp-ts/lib/Option";
import {pipe} from "fp-ts/lib/pipeable";

export class StoreBase {
    protected subject: Subject<any>;
    public state: any;

    constructor(private parent: Option<StoreBase> = none) {
        this.subject = new Subject();
    }

    public subscribe(callback: (_: any) => void): Subscription {
        return this.subject.subscribe(callback)
    }

    protected updated() {
        this.subject.next(this.state);
        pipe(this.parent, map(it => it.updated()))
    }
}
