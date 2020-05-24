import {some} from "fp-ts/lib/Option";
import {UserStore} from "./user";
import {StoreBase} from "./base";
import {DepartmentStore} from "./department";
import {TeacherStore} from "./teacher";
import {StudentStore} from "./student";
import {SemesterStore} from "./semester";
import {CourseStore} from "./course";

class Store extends StoreBase {
    public state: {
        user: UserStore,
        semesters: SemesterStore,
        departments: DepartmentStore,
        teachers: TeacherStore,
        students: StudentStore,
        courses: CourseStore
    };

    constructor() {
        super();
        this.state = {
            user: new UserStore(some(this)),
            semesters: new SemesterStore(some(this)),
            departments: new DepartmentStore(some(this)),
            teachers: new TeacherStore(some(this)),
            students: new StudentStore(some(this)),
            courses: new CourseStore(some(this))
        }
    }
}

export const store = new Store();
