import React, {useEffect, useState} from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import {store} from "../store/store";
import {isSome} from "fp-ts/lib/Option";

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(1)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    }
}));

export default function SignIn(props: any) {
    const classes = useStyles();
    const [storeState, _] = useState(store.state.user);
    useEffect(() => {
        const subscription = storeState.subscribe((x) => {
            if (isSome(x)) {
                props.history.push("/");
            }
        });
        return () => {
            subscription.unsubscribe();
        }
    }, [props.history]);
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}/>
                <Typography component="h1" variant="h5">
                    登录
                </Typography>
                <form className={classes.form}
                      noValidate
                      onSubmit={(e) => {
                          e.preventDefault();
                          storeState.login(
                              (e.target as any).elements.username.value.trim(),
                              (e.target as any).elements.password.value.trim())
                      }}
                >
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="用户名"
                        name="username"
                        autoComplete="username"
                        autoFocus
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="密码"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        登录
                    </Button>
                </form>
            </div>
        </Container>
    );
}
