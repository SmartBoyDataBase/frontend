import React, {useEffect} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {store} from "../../store/store";
import {TeacherState} from "../../store/teacher";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    FormLabel,
    Paper,
    Radio,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@material-ui/core";
import {format, formatDistanceToNow, parse} from "date-fns";
import RadioGroup from "@material-ui/core/RadioGroup";

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
export default function Teacher(props: any) {
    const classes = useStyles();
    const [storeState, setStore] = React.useState(
        Array.from(store.state.teachers.state.values())
    );
    const [open, setOpen] = React.useState(false);
    const [editing, setEditing] = React.useState({
        id: 0,
        name: "",
        birthday: new Date(),
        sex: 'male' as "male" | "female",
        username: '',
        password: ''
    });
    useEffect(() => {
        store.state.teachers.subscribe((x) => {
            setStore(Array.from(x.values()));
        });
        store.state.teachers.fetchAll();
    }, []);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        store.state.teachers.set(editing);
        setOpen(false);
    };
    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="custom pagination table">
                <TableHead>
                    <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell>名字</TableCell>
                        <TableCell>年龄</TableCell>
                        <TableCell>性别</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {storeState.map((teacher: TeacherState) => {
                        return (
                            <TableRow key={teacher.id}>
                                <TableCell component="td" scope="row">
                                    {teacher.id}
                                </TableCell>
                                <TableCell component="td" scope="row">
                                    {teacher.name}
                                </TableCell>
                                <TableCell component="td" scope="row">
                                    {formatDistanceToNow(teacher.birthday)}
                                </TableCell>
                                <TableCell component="td" scope="row">
                                    {teacher.sex}
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
                        请输入教师信息
                    </DialogContentText>
                    <TextField
                        autoFocus
                        value={editing.username}
                        onChange={(e) => {
                            setEditing({
                                ...editing,
                                username: e.target.value
                            })
                        }}
                        margin="dense"
                        id="username"
                        label="username"
                        type="text"
                        fullWidth/>
                    <TextField
                        autoFocus
                        value={editing.password}
                        onChange={(e) => {
                            setEditing({
                                ...editing,
                                password: e.target.value
                            })
                        }}
                        margin="dense"
                        id="password"
                        label="password"
                        type="password"
                        fullWidth/>
                    <TextField
                        autoFocus
                        value={editing.name}
                        onChange={(e) => {
                            setEditing({
                                ...editing,
                                name: e.target.value
                            })
                        }}
                        margin="dense"
                        id="name"
                        label="name"
                        type="text"
                        fullWidth/>
                    <TextField
                        autoFocus
                        value={format(editing.birthday, 'yyyy-MM-dd')}
                        onChange={(e) => {
                            setEditing({
                                ...editing,
                                birthday: parse(e.target.value, 'yyyy-MM-dd', new Date())
                            })
                        }}
                        margin="dense"
                        id="birthday"
                        label="birthday"
                        type="birthday"
                        fullWidth/>
                    <FormLabel component="legend">性别</FormLabel>
                    <RadioGroup aria-label="性别" name="性别" value={editing.sex} onChange={(e) => {
                        setEditing({
                            ...editing,
                            sex: e.target.value as 'male' | 'female'
                        })
                    }}>
                        <FormControlLabel value="female" control={<Radio/>} label="Female"/>
                        <FormControlLabel value="male" control={<Radio/>} label="Male"/>
                    </RadioGroup>
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
