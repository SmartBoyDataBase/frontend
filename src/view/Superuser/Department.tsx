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
import DeleteIcon from '@material-ui/icons/Delete';

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

export default function Department(props: any) {
    const classes = useStyles();
    const [storeState, setStore] = React.useState(
        Array.from(store.state.departments.state.values())
    );
    const [open, setOpen] = React.useState(false);
    const [editing, setEditing] = React.useState({
        id: 0,
        name: "",
        admin: 1
    });
    useEffect(() => {
        store.state.departments.subscribe((x) => {
            setStore(Array.from(x.values()));
        });
        store.state.departments.fetchAll();
    }, []);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        store.state.departments.set(editing);
        setOpen(false);
    };
    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="custom pagination table">
                <TableHead>
                    <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell>名字</TableCell>
                        <TableCell>管理员</TableCell>
                        <TableCell>编辑</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {storeState.map((department: any) => {
                        return (
                            <TableRow key={department.id}>
                                <TableCell component="td" scope="row">
                                    {department.id}
                                </TableCell>
                                <TableCell component="td" scope="row">
                                    {department.name}
                                </TableCell>
                                <TableCell component="td" scope="row">
                                    {department.admin}
                                </TableCell>
                                <TableCell component="td" scope="row">
                                    <Button
                                        color="secondary"
                                        variant="contained"
                                        startIcon={<DeleteIcon/>}
                                        onClick={(e) => {
                                            store.state.departments.delete(department)
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
                        请输入学院名称
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
                        id="department"
                        label="Department"
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
