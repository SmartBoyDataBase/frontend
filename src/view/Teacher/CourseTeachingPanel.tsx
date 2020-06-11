import React, {useEffect} from "react";

import {CourseState} from "../../store/course";
import {
    createStyles,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary, Paper, Table, TableCell, TableContainer, TableHead, TableRow, TextField,
    Theme,
    Typography
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {store} from "../../store/store";
import {toNullable} from "fp-ts/lib/Option";
import {TeachCourseState} from "../../store/teachCourse";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        table: {
            minWidth: 500,
        },
        root: {
            width: '100%',
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
            fontWeight: theme.typography.fontWeightRegular,
        },
    }),
);
export default function CourseTeachingPanel(props: { courseTeaching: TeachCourseState }) {
    const classes = useStyles();
    const [storeState, setStore] = React.useState(store.state);
    const course = store.state.courses.state.get(props.courseTeaching.course_id);
    useEffect(() => {
        store.subscribe(state => setStore({...state}));
        store.state.students.fetchAll();
        store.state.courseSelections.fetchByTeachCourse(props.courseTeaching.id);
    }, []);

    return (
        <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>} aria-controls="panel-content" id="panel1a-header">
                <Typography
                    className={classes.heading}>{course?.name}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                {/*todo: 成绩比例*/}
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="">
                        <TableHead>
                            <TableRow>
                                <TableCell>学号</TableCell>
                                <TableCell>姓名</TableCell>
                                <TableCell>平时成绩</TableCell>
                                <TableCell>考试成绩</TableCell>
                                <TableCell>总评成绩</TableCell>
                            </TableRow>
                            {Array.from(storeState.courseSelections.state.values())
                                .filter(it => it.teach_course_id === props.courseTeaching.id)
                                .map((courseSelection) => {
                                    return (
                                        <TableRow key={courseSelection.student_id}>
                                            <TableCell>{courseSelection.student_id}</TableCell>
                                            <TableCell>{storeState.students.state.get(courseSelection.student_id)!.name}</TableCell>
                                            <TableCell>
                                                <TextField
                                                    id="regular-score"
                                                    label="Regular score"
                                                    type="number"
                                                    value={courseSelection.regular_grade}
                                                    onChange={(e) => {
                                                        //todo: Store.giveRegularScore(props.course.id, courseSelection.student_id, parseInt(e.target.value));
                                                    }}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    id="exam-score"
                                                    label="Exam score"
                                                    type="number"
                                                    value={courseSelection.exam_grade}
                                                    onChange={(e) => {
                                                        // todo: Store.giveExamScore(props.course.id, courseSelection.student_id, parseInt(e.target.value));
                                                    }}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            </TableCell>
                                        </TableRow>);
                                })}
                        </TableHead>
                    </Table>
                </TableContainer>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    )
}
