import React, {useEffect} from "react";
import {store} from "../../store/store";
import {toNullable} from "fp-ts/lib/Option";
import {TableContainer} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {TeachCourseState} from "../../store/teachCourse";
import Checkbox from "@material-ui/core/Checkbox";

export default function MyCourseSelection(props: any) {
    const [courseSelections, setCourseSelections] = React.useState(
        Array.from(store.state.courseSelections.state.values())
    );
    const [teachCourses, setTeachCourses] = React.useState(
        Array.from(store.state.teachCourses.state.values())
    );
    const [courses, setCourses] = React.useState(
        Array.from(store.state.courses.state.values())
    );
    const [teachers, setTeachers] = React.useState(
        Array.from(store.state.teachers.state.values())
    );
    const [semesters, setSemesters] = React.useState(
        Array.from(store.state.semesters.state.values())
    );
    useEffect(() => {
        store.state.courseSelections.subscribe((x) => {
            setCourseSelections(Array.from(x.values()));
        });
        store.state.courses.subscribe((x) => {
            setCourses(Array.from(x.values()));
        });
        store.state.teachCourses.subscribe((x) => {
            setTeachCourses(Array.from(x.values()));
        });
        store.state.teachers.subscribe((x) => {
            setTeachers(Array.from(x.values()));
        });
        store.state.semesters.subscribe((x) => {
            setSemesters(Array.from(x.values()));
        });
        store.state.courseSelections
            .fetchByStudent(toNullable(store.state.user.state)?.id!);
        store.state.courses.fetchAll();
        store.state.teachCourses.fetchAll();
        store.state.teachers.fetchAll();
        store.state.semesters.fetchAll();
    }, []);
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>课程Id</TableCell>
                        <TableCell>课程名称</TableCell>
                        <TableCell>教师</TableCell>
                        <TableCell>学期</TableCell>
                        <TableCell>平时成绩</TableCell>
                        <TableCell>考试成绩</TableCell>
                        <TableCell>总评成绩</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {teachCourses.map((teachCourse: TeachCourseState) => {
                        return (
                            <TableRow
                                key={teachCourse.id}>
                                <TableCell component="td" scope="row">
                                    {teachCourse.id}
                                </TableCell>
                                <TableCell component="td" scope="row">
                                    {courses.find(it => teachCourse.course_id === it.id)?.name}
                                </TableCell>
                                <TableCell component="td" scope="row">
                                    {teachers.find(it => it.id === teachCourse.teacher_id)?.name}
                                </TableCell>
                                <TableCell component="td" scope="row">
                                    {semesters.find(it => it.id === teachCourse.semester_id)?.name}
                                </TableCell>
                                <TableCell component="td" scope="row">
                                    {courseSelections
                                        .find(it => it.teach_course_id === teachCourse.id && it.student_id === toNullable(store.state.user.state)!.id)?.regular_grade}
                                </TableCell>
                                <TableCell component="td" scope="row">
                                    {courseSelections
                                        .find(it => it.teach_course_id === teachCourse.id && it.student_id === toNullable(store.state.user.state)!.id)?.exam_grade}
                                </TableCell>
                                <TableCell component="td" scope="row">
                                    {courseSelections
                                        .find(it => it.teach_course_id === teachCourse.id && it.student_id === toNullable(store.state.user.state)!.id)?.final_grade}
                                </TableCell>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={courseSelections.find(it => it.teach_course_id === teachCourse.id && it.student_id === toNullable(store.state.user.state)!.id) !== undefined}
                                        disabled={
                                            courseSelections.find(it => it.teach_course_id === teachCourse.id && it.student_id === toNullable(store.state.user.state)!.id)?.regular_grade !== undefined ||
                                            courseSelections.find(it => it.teach_course_id === teachCourse.id && it.student_id === toNullable(store.state.user.state)!.id)?.exam_grade !== undefined
                                        }
                                        onChange={(e) => {
                                            if (e.target.checked)
                                                store.state.courseSelections.set({
                                                    student_id: toNullable(store.state.user.state)!.id,
                                                    teach_course_id: teachCourse.id
                                                })
                                            else {
                                                store.state.courseSelections.delete({
                                                    student_id: toNullable(store.state.user.state)!.id,
                                                    teach_course_id: teachCourse.id
                                                })
                                            }
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
