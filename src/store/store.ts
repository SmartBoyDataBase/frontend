import {some} from "fp-ts/lib/Option";
import {UserStore} from "./user";
import {StoreBase} from "./base";
import {DepartmentStore} from "./department";
import {TeacherStore} from "./teacher";
import {StudentStore} from "./student";
import {SemesterStore} from "./semester";
import {CourseStore} from "./course";
import {TeachCourseStore} from "./teachCourse";
import {CourseSelectionStore} from "./courseSelection";
import {Subscription} from "rxjs";

export interface State {
    user: UserStore;
    semesters: SemesterStore;
    departments: DepartmentStore;
    teachers: TeacherStore;
    students: StudentStore;
    courses: CourseStore;
    teachCourses: TeachCourseStore;
    courseSelections: CourseSelectionStore;
}

class Store extends StoreBase {
    public state: State;

    constructor() {
        super();
        this.state = {
            user: new UserStore(some(this)),
            semesters: new SemesterStore(some(this)),
            departments: new DepartmentStore(some(this)),
            teachers: new TeacherStore(some(this)),
            students: new StudentStore(some(this)),
            courses: new CourseStore(some(this)),
            teachCourses: new TeachCourseStore(some(this)),
            courseSelections: new CourseSelectionStore(some(this))
        }
    }

    public subscribe(callback: (_: State) => void): Subscription {
        return this.subject.subscribe(callback)
    }
}

export const store = new Store();
