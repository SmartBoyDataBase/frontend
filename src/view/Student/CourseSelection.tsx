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
    const [courses, setCourses] = React.useState(
        Array.from(store.state.teachCourses.state.values())
    );
    useEffect(() => {
        store.state.courseSelections.subscribe((x) => {
            setCourseSelections(Array.from(x.values()));
        });
        store.state.teachCourses.subscribe((x) => {
            setCourses(Array.from(x.values()));
        })
        store.state.courseSelections
            .fetchByStudent(toNullable(store.state.user.state)?.id!);
        store.state.teachCourses.fetchAll();
    }, []);
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>课程Id</TableCell>
                        <TableCell>平时成绩</TableCell>
                        <TableCell>考试成绩</TableCell>
                        <TableCell>总评成绩</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {courses.map((course: TeachCourseState) => {
                        return (
                            <TableRow
                                key={course.id}>
                                <TableCell component="td" scope="row">
                                    {course.id}
                                </TableCell>
                                <TableCell component="td" scope="row">
                                    {courseSelections
                                        .find(it => it.teach_course_id === course.id)?.regular_grade}
                                </TableCell>
                                <TableCell component="td" scope="row">
                                    {courseSelections
                                        .find(it => it.teach_course_id === course.id)?.exam_grade}
                                </TableCell>
                                <TableCell component="td" scope="row">
                                    {courseSelections
                                        .find(it => it.teach_course_id === course.id)?.final_grade}
                                </TableCell>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={courseSelections.find(it => it.teach_course_id === course.id) !== undefined}
                                        disabled={
                                            courseSelections.find(it => it.regular_grade) !== undefined ||
                                            courseSelections.find(it => it.exam_grade) !== undefined
                                        }
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
