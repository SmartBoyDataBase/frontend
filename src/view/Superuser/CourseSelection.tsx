import React, {useEffect} from "react";
import {InputLabel, MenuItem, Select, TableContainer} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import {store} from "../../store/store";
import DeleteIcon from "@material-ui/icons/Delete";

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

export default function CourseSelection(props: any) {
    const classes = useStyles();
    const [courseSelection, setCourseSelection] = React.useState(
        Array.from(store.state.courseSelections.state)
    );
    const [students, setStudents] = React.useState(
        Array.from(store.state.students.state.values())
    );
    const [open, setOpen] = React.useState(false);
    const [editing, setEditing] = React.useState({
        student_id: 0,
        teach_course_id: 0,
        regular_grade: undefined as number | undefined,
        exam_grade: undefined as number | undefined,
        final_grade: undefined as number | undefined,
    });
    useEffect(() => {
        store.state.courseSelections.subscribe((x) => {
            setCourseSelection(Array.from(x));
        });
        store.state.students.subscribe((x) => {
            setStudents(Array.from(x.values()));
        });
        store.state.courseSelections.fetchAll();
        store.state.teachCourses.fetchAll();
        store.state.students.fetchAll();
    }, []);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        store.state.courseSelections.set(editing);
        setOpen(false);
    };
    return (
        <TableContainer component={Paper}>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell>学生</TableCell>
                        <TableCell>课程</TableCell>
                        <TableCell>平时成绩</TableCell>
                        <TableCell>考试成绩</TableCell>
                        <TableCell>总评成绩</TableCell>
                        <TableCell>编辑</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {courseSelection.map((courseSelection: any) => {
                        return (
                            <TableRow
                                key={`${courseSelection.student_id}-${courseSelection.course_id}`}>
                                <TableCell component="td" scope="row">
                                    {students.find(it => it.id === courseSelection.student_id)?.name}
                                </TableCell>
                                <TableCell component="td" scope="row">
                                    {courseSelection.teach_course_id}
                                </TableCell>
                                <TableCell component="td" scope="row">
                                    {courseSelection.regular_grade}
                                </TableCell>
                                <TableCell component="td" scope="row">
                                    {courseSelection.exam_grade}
                                </TableCell>
                                <TableCell component="td" scope="row">
                                    {courseSelection.final_grade}
                                </TableCell>
                                <TableCell component="td" scope="row">
                                    <Button
                                        color="secondary"
                                        variant="contained"
                                        startIcon={<DeleteIcon/>}
                                        onClick={(e) => {
                                            store.state.courseSelections.delete(courseSelection)
                                        }}
                                    >删除</Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            <Button className={classes.addButton} onClick={handleClickOpen}>+</Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">新建</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        请输入选课信息
                    </DialogContentText>
                    <div>
                        <InputLabel id="student-label">学生</InputLabel>
                        <Select
                            labelId="student-label"
                            value={editing.student_id}
                            onChange={(e) => {
                                setEditing({
                                    ...editing,
                                    student_id: e.target.value as number,
                                })
                            }}>
                            {
                                Array.from(store.state.students.state.values())
                                    .map(student => <MenuItem value={student.id}>{student.name}</MenuItem>)
                            }
                        </Select>
                    </div>
                    <div>
                        <InputLabel id="teach-course-label">开课id</InputLabel>
                        <Select
                            labelId="teach-course-label"
                            value={editing.teach_course_id}
                            onChange={(e) => {
                                setEditing({
                                    ...editing,
                                    teach_course_id: e.target.value as number,
                                })
                            }}>
                            {
                                Array.from(store.state.teachCourses.state.values())
                                    .map(teachCourse => <MenuItem value={teachCourse.id}>{teachCourse.id}</MenuItem>)
                            }
                        </Select>
                    </div>
                    <TextField
                        autoFocus
                        value={editing.regular_grade}
                        onChange={(e) => {
                            setEditing({
                                ...editing,
                                regular_grade: e.target.value === "" ? undefined : parseInt(e.target.value)
                            });
                        }}
                        margin="dense"
                        id="regularGrade"
                        label="regularGrade"
                        type="text"
                        fullWidth/>
                    <TextField
                        autoFocus
                        value={editing.exam_grade}
                        onChange={(e) => {
                            setEditing({
                                ...editing,
                                exam_grade: e.target.value === "" ? undefined : parseInt(e.target.value)
                            });
                        }}
                        margin="dense"
                        id="examGrade"
                        label="examGrade"
                        type="text"
                        fullWidth/>
                    <TextField
                        autoFocus
                        value={editing.final_grade}
                        onChange={(e) => {
                            setEditing({
                                ...editing,
                                final_grade: e.target.value === "" ? undefined : parseInt(e.target.value)
                            });
                        }}
                        margin="dense"
                        id="finalGrade"
                        label="finalGrade"
                        type="text"
                        fullWidth/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        取消
                    </Button>
                    <Button onClick={handleClose} color="primary">
                        确定
                    </Button>
                </DialogActions>
            </Dialog>
        </TableContainer>
    )
}
