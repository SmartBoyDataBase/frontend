import React, {useEffect} from "react";
import {TableContainer} from "@material-ui/core";
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

export default function TeachCourse(props: any) {
    const classes = useStyles();
    const [teachCourses, setTeachCourses] = React.useState(
        Array.from(store.state.teachCourses.state.values())
    );
    const [semesters, setSemesters] = React.useState(
        Array.from(store.state.semesters.state.values())
    );
    const [courses, setCourses] = React.useState(
        Array.from(store.state.courses.state.values())
    );
    const [teachers, setTeachers] = React.useState(
        Array.from(store.state.teachers.state.values())
    );
    const [open, setOpen] = React.useState(false);
    const [editing, setEditing] = React.useState({
        id: 0,
        course_id: 0,
        teacher_id: 0,
        semester_id: 0
    });
    useEffect(() => {
        store.state.teachCourses.subscribe((x) => {
            setTeachCourses(Array.from(x.values()));
        });
        store.state.semesters.subscribe((x) => {
            setSemesters(Array.from(x.values()));
        });
        store.state.courses.subscribe((x) => {
            setCourses(Array.from(x.values()));
        });
        store.state.teachers.subscribe((x) => {
            setTeachers(Array.from(x.values()));
        });
        store.state.semesters.fetchAll();
        store.state.courses.fetchAll();
        store.state.teachers.fetchAll();
        store.state.teachCourses.fetchAll();
    }, []);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        store.state.teachCourses.set(editing);
        setOpen(false);
    };
    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="custom pagination table">
                <TableHead>
                    <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell>学期</TableCell>
                        <TableCell>课程</TableCell>
                        <TableCell>教师</TableCell>
                        <TableCell>编辑</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {teachCourses.map((teachCourse: any) => {
                        return (
                            <TableRow
                                key={teachCourse.id}>
                                <TableCell component="td" scope="row">
                                    {teachCourse.id}
                                </TableCell>
                                <TableCell component="td" scope="row">
                                    {semesters.find(it => it.id === teachCourse.semester_id)?.name}
                                </TableCell>
                                <TableCell component="td" scope="row">
                                    {courses.find(it => it.id === teachCourse.course_id)?.name}
                                </TableCell>
                                <TableCell component="td" scope="row">
                                    {teachers.find(it => it.id === teachCourse.teacher_id)?.name}
                                </TableCell>
                                <TableCell component="td" scope="row">
                                    <Button
                                        color="secondary"
                                        variant="contained"
                                        startIcon={<DeleteIcon/>}
                                        onClick={(e) => {
                                            store.state.teachCourses.delete(teachCourse)
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
                        请输入开课信息
                    </DialogContentText>
                    <TextField
                        autoFocus
                        value={editing.semester_id}
                        onChange={(e) => {
                            setEditing({
                                ...editing,
                                semester_id: parseInt(e.target.value)
                            });
                        }}
                        margin="dense"
                        id="semesterId"
                        label="semesterId"
                        type="text"
                        fullWidth/>
                    <TextField
                        autoFocus
                        value={editing.course_id}
                        onChange={(e) => {
                            setEditing({
                                ...editing,
                                course_id: parseInt(e.target.value)
                            });
                        }}
                        margin="dense"
                        id="courseId"
                        label="courseId"
                        type="text"
                        fullWidth/>
                    <TextField
                        autoFocus
                        value={editing.teacher_id}
                        onChange={(e) => {
                            setEditing({
                                ...editing,
                                teacher_id: parseInt(e.target.value)
                            });
                        }}
                        margin="dense"
                        id="teacherId"
                        label="teacherId"
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
