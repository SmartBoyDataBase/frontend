import React, {useEffect} from "react";
import {TableContainer} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {store} from "../../store/store";
import {toNullable} from "fp-ts/lib/Option";
import CourseTeachingPanel from "./CourseTeachingPanel";
import TeachCourse from "../Superuser/TeachCourse";
import {TeachCourseState} from "../../store/teachCourse";

const useStyles = makeStyles({
    table: {
        minWidth: 500,
    },
    addButton: {
        width: '100%',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0
    }
});

export default function MyCourseTeaching(props: any) {
    const classes = useStyles();
    const [storeState, setStore] = React.useState({...store.state});
    useEffect(() => {
        store.state.students.fetchAll();
        store.state.teachCourses.fetchForTeacher(toNullable(store.state.user.state)!.id);
        store.state.teachCourses.subscribe(fetched => {
            const courseIds = new Set(Array.from(fetched.values())
                .map(it => it.course_id));
            const semesterIds = new Set(Array.from(fetched.values())
                .map(it => it.semester_id));
            for (let courseId of courseIds.values()) {
                store.state.courses.fetch(courseId);
            }
            for (let semesterId of semesterIds.values()) {
                store.state.semesters.fetch(semesterId);
            }
        });
        store.subscribe(x => setStore({...x}));
    }, []);
    return (
        <div>
            {
                Array.from(storeState.teachCourses.state.values())
                    .filter(teachCourse => teachCourse.teacher_id === toNullable(store.state.user.state)!.id)
                    .map(teachCourse =>
                        <CourseTeachingPanel key={teachCourse.id}
                                             courseTeaching={teachCourse}/>
                    )
            }
        </div>
    )
}
