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

    public subscribe(callback: (_: Array<CourseSelectionState>) => void): Subscription {
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
                response.response
                    .forEach((it: CourseSelectionState) => {
                            this.state = this.state.filter(old => !(old.teach_course_id === it.teach_course_id && old.student_id === it.student_id));
                            this.state.push(it);
                        }
                    );
                this.updated();
            })
    }

    public fetchByTeachCourse(id: number) {
        Ajax.get(`api/course-selections?teachcourse_id=${id}`)
            .subscribe(response => {
                response.response.forEach((it: CourseSelectionState) => {
                        this.state = this.state.filter(old => !(old.teach_course_id === it.teach_course_id && old.student_id === it.student_id));
                        this.state.push(it);
                    }
                );
                this.updated();
            })
    }

    public fetchByStudent(id: number) {
        Ajax.get(`api/course-selections?student=${id}`)
            .subscribe(response => {
                response.response.forEach((it: CourseSelectionState) =>
                    this.state.push(it)
                );
                this.updated();
            })
    }

    public put(courseSelection: CourseSelectionState) {
        Ajax.put(`api/course-selection`, courseSelection)
            .subscribe((response) => {
                this.state.splice(
                    this.state.findIndex(
                        it => (
                            it.student_id == response.response.student_id &&
                            it.teach_course_id === response.response.teach_course_id
                        )), 1, response.response);
                this.updated();
            })
    }

    public giveFinalGrade(teachcourse_id: number, regular_percentage: number) {
        Ajax.post(`api/give-final-grade`, {
            teachcourse_id: teachcourse_id,
            regular_percentagea: regular_percentage,
            exam_percentage: 100 - regular_percentage
        }).subscribe(() => this.fetchByTeachCourse(teachcourse_id))
    }
}
