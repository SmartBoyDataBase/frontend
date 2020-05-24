import {StoreBase} from "./base";
import {Subscription} from "rxjs";
import {Ajax} from "../service/ajax";
import {Option} from "fp-ts/lib/Option";

export interface TeachCourseState {
    course_id: number,
    teacher_id: number,
    semester_id: number
}

export class TeachCourseStore extends StoreBase {
    state: Array<TeachCourseState>;

    constructor(parent: Option<StoreBase>) {
        super(parent);
        this.state = new Array<TeachCourseState>();
    }

    public subscribe(callback: (_: Map<number, TeachCourseState>) => void): Subscription {
        return super.subscribe(callback)
    }

    public set(teacherCourse: TeachCourseState) {
        Ajax.post(`api/teach-course?course_id=${teacherCourse.course_id}&teacher_id=${teacherCourse.teacher_id}&semester_id=${teacherCourse.semester_id}`, {})
            .subscribe((response) => {
                this.state.push(response.response);
                this.updated();
            })
    }


    public fetchAll() {
        Ajax.get('api/teach-courses')
            .subscribe(response => {
                response.response.forEach((it: TeachCourseState) =>
                    this.state.push(it)
                );
                this.updated();
            })
    }
}
