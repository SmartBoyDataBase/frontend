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

export default function Course(props: any) {
    const classes = useStyles();
    const [storeState, setStore] = React.useState(
        Array.from(store.state.courses.state.values())
    );
    const [open, setOpen] = React.useState(false);
    const [editing, setEditing] = React.useState({
        id: 0,
        name: '',
        credit: 0,
        college_id: 0
    });
    useEffect(() => {
        store.state.courses.subscribe((x) => {
            setStore(Array.from(x.values()));
        });
        store.state.courses.fetchAll();
    }, []);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        store.state.courses.set(editing);
        setOpen(false);
    };
    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="custom pagination table">
                <TableHead>
                    <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell>名字</TableCell>
                        <TableCell>学分</TableCell>
                        <TableCell>学院</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {storeState.map((course: any) => {
                        return (
                            <TableRow key={course.id}>
                                <TableCell component="td" scope="row">
                                    {course.id}
                                </TableCell>
                                <TableCell component="td" scope="row">
                                    {course.name}
                                </TableCell>
                                <TableCell component="td" scope="row">
                                    {course.credit}
                                </TableCell>
                                <TableCell component="td" scope="row">
                                    {course.college_id}
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
                        请输入课程信息
                    </DialogContentText>
                    <TextField
                        autoFocus
                        value={editing.name}
                        onChange={(e) => {
                            setEditing({
                                ...editing,
                                name: e.target.value
                            });
                        }}
                        margin="dense"
                        id="name"
                        label="name"
                        type="text"
                        fullWidth/>
                    <TextField
                        autoFocus
                        value={editing.credit}
                        onChange={(e) => {
                            setEditing({
                                ...editing,
                                credit: parseInt(e.target.value, 10)
                            });
                        }}
                        margin="dense"
                        id="credit"
                        label="credit"
                        type="number"
                        fullWidth/>
                    <TextField
                        autoFocus
                        value={editing.college_id}
                        onChange={(e) => {
                            setEditing({
                                ...editing,
                                college_id: parseInt(e.target.value, 10)
                            });
                        }}
                        margin="dense"
                        id="college_id"
                        label="college_id"
                        type="number"
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
