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
import {store} from "../store/store";

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
    const [storeState, setStore] = React.useState(
        Array.from(store.state.teachCourses.state.values())
    );
    const [open, setOpen] = React.useState(false);
    const [editing, setEditing] = React.useState({
        course_id: 0,
        teacher_id: 0,
        semester_id: 0
    });
    useEffect(() => {
        store.state.teachCourses.subscribe((x) => {
            setStore(Array.from(x.values()));
        });
        if (store.state.teachCourses.state.length === 0)
            store.state.teachCourses.fetchAll();
    });
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
                        <TableCell>学期</TableCell>
                        <TableCell>课程</TableCell>
                        <TableCell>教师</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {storeState.map((teachCourse: any) => {
                        return (
                            <TableRow key={`${teachCourse.semester_id}-${teachCourse.course_id}-${teachCourse.teacher_id}`}>
                                <TableCell component="td" scope="row">
                                    {teachCourse.semester_id}
                                </TableCell>
                                <TableCell component="td" scope="row">
                                    {teachCourse.course_id}
                                </TableCell>
                                <TableCell component="td" scope="row">
                                    {teachCourse.teacher_id}
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
