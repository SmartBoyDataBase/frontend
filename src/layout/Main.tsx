import React, {useEffect} from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {Button, List, ListItem, ListItemIcon, ListItemProps, ListItemText} from "@material-ui/core";
import Hidden from "@material-ui/core/Hidden";
import useTheme from "@material-ui/core/styles/useTheme";
import {Route, Switch} from "react-router-dom";
import {store} from "../store/store";
import {isNone, map, toNullable} from "fp-ts/lib/Option";
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import PeopleIcon from '@material-ui/icons/People';
import BookIcon from '@material-ui/icons/Book';
import DvrIcon from '@material-ui/icons/Dvr';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import Department from "../view/Superuser/Department";
import Teacher from "../view/Superuser/Teacher";
import Student from "../view/Superuser/Student";
import Semester from "../view/Superuser/Semester";
import Course from "../view/Superuser/Course";
import TeachCourse from "../view/Superuser/TeachCourse";
import CourseSelection from "../view/Superuser/CourseSelection";
import {pipe} from "fp-ts/lib/pipeable";
import MyCourseTeaching from "../view/Teacher/MyCourseTeaching";
import MyCourseSelection from "../view/Student/CourseSelection";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        drawer: {
            [theme.breakpoints.up('sm')]: {
                width: drawerWidth,
                flexShrink: 0,
            },
        },
        appBar: {
            [theme.breakpoints.up('sm')]: {
                width: `calc(100% - ${drawerWidth}px)`,
                marginLeft: drawerWidth,
            },
        },
        menuButton: {
            marginRight: theme.spacing(2),
            [theme.breakpoints.up('sm')]: {
                display: 'none',
            },
        },
        toolbar: theme.mixins.toolbar,
        drawerPaper: {
            width: drawerWidth,
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
        },
        logout: {
            color: "white",
            background: "red",
            marginLeft: "40px",
            '&:hover': {
                color: "white",
                background: "red",
            }
        }
    }),
);

function ListItemLink(props: ListItemProps<'a', { button?: true }>) {
    return <ListItem button component="a" {...props} />;
}

function FunctionList() {
    const [storeState, _] = React.useState(store.state.user);
    let type = pipe(storeState.state, map(it => it.role), toNullable);
    switch (type) {
        case "superuser":
            return (
                <List>
                    <ListItemLink href="/#/department">
                        <ListItemIcon><AccountBalanceIcon/></ListItemIcon>
                        <ListItemText>学院管理</ListItemText>
                    </ListItemLink>
                    <ListItemLink href="/#/semester">
                        <ListItemIcon><PeopleIcon/></ListItemIcon>
                        <ListItemText>学期管理</ListItemText>
                    </ListItemLink>
                    <ListItemLink href="/#/student">
                        <ListItemIcon><PeopleIcon/></ListItemIcon>
                        <ListItemText>学生管理</ListItemText>
                    </ListItemLink>
                    <ListItemLink href="/#/teacher">
                        <ListItemIcon><AssignmentIndIcon/></ListItemIcon>
                        <ListItemText>教师管理</ListItemText>
                    </ListItemLink>
                    <ListItemLink href="/#/course">
                        <ListItemIcon><BookIcon/></ListItemIcon>
                        <ListItemText>课程管理</ListItemText>
                    </ListItemLink>
                    <ListItemLink href="/#/course-teaching">
                        <ListItemIcon><DvrIcon/></ListItemIcon>
                        <ListItemText>开课管理</ListItemText>
                    </ListItemLink>
                    <ListItemLink href="/#/course-selection">
                        <ListItemIcon><DvrIcon/></ListItemIcon>
                        <ListItemText>选课管理</ListItemText>
                    </ListItemLink>
                </List>
            )
        case "teacher":
            return (
                <List>
                    <ListItemLink href="/#/my-courses-teaching">
                        <ListItemIcon><BookIcon/></ListItemIcon>
                        <ListItemText>我教的课程</ListItemText>
                    </ListItemLink>
                </List>
            )
        case "student":
            return (
                <List>
                    <ListItemLink href="/#/my-course-selection">
                        <ListItemIcon><DvrIcon/></ListItemIcon>
                        <ListItemText>选课管理</ListItemText>
                    </ListItemLink>
                </List>
            )
    }
    return <List/>
}

export default function Main(props: { container: any, history: any, children: any }) {
    const {container} = props;
    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    useEffect(() => {
        if (isNone(store.state.user.state)) {
            props.history.push("login");
        }
    }, [props.history]);
    return (
        <div className={classes.root}>
            <CssBaseline/>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        className={classes.menuButton}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        {/*{toNullable(storeState.user)?.type}*/}
                    </Typography>
                    <Button className={classes.logout} onClick={() => store.state.user.logout()}>退出</Button>
                </Toolbar>
            </AppBar>
            <nav className={classes.drawer} aria-label="mailbox folders">
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Hidden smUp implementation="css">
                    <Drawer
                        container={container}
                        variant="temporary"
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        <FunctionList/>
                    </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        variant="permanent"
                        open
                    >
                        <FunctionList/>
                    </Drawer>
                </Hidden>
            </nav>
            <main className={classes.content}>
                <div className={classes.toolbar}/>
                <Switch>
                    <Route exact path="/department" component={Department}/>
                    <Route exact path="/student" component={Student}/>
                    <Route exact path="/teacher" component={Teacher}/>
                    <Route exact path="/semester" component={Semester}/>
                    <Route exact path="/course" component={Course}/>
                    <Route exact path="/course-selection" component={CourseSelection}/>
                    <Route exact path="/course-teaching" component={TeachCourse}/>
                    <Route exact path="/my-courses-teaching" component={MyCourseTeaching}/>
                    <Route exact path="/my-course-selection" component={MyCourseSelection}/>
                    <Route exact path="/">
                        <p>请在左侧选取功能</p>
                    </Route>
                </Switch>
            </main>
        </div>
    );
}
