import {StoreBase} from "./base";
import {Option} from "fp-ts/lib/Option";
import {Subscription} from "rxjs";
import {Ajax} from "../service/ajax";

export interface CourseSelectionState {
    student_id: number,
    teach_course_id: number,
    regular_grade?: number,
    exam_grade?: number,
    final_grade?: number,
}

export class CourseSelectionStore extends StoreBase {
    state: Array<CourseSelectionState>;

    constructor(parent: Option<StoreBase>) {
        super(parent);
        this.state = new Array<CourseSelectionState>();
    }

    public subscribe(callback: (_: Map<number, CourseSelectionState>) => void): Subscription {
        return super.subscribe(callback)
    }

    public set(courseSelection: CourseSelectionState) {
        Ajax.post(`api/course-selection`, courseSelection)
            .subscribe((response) => {
                this.state.push(response.response);
                this.updated();
            })
    }


    public fetchAll() {
        Ajax.get('api/course-selections')
            .subscribe(response => {
                console.log(response);
                response.response.forEach((it: CourseSelectionState) =>
                    this.state.push(it)
                );
                this.updated();
            })
    }
}
