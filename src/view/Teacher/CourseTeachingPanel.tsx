import React, {useEffect} from "react";
import {
    createStyles,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    Paper,
    Slider,
    Table,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Theme,
    Typography
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {store} from "../../store/store";
import {TeachCourseState} from "../../store/teachCourse";
import Button from "@material-ui/core/Button";

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
        panel: {
            flexDirection: 'column'
        }
    }),
);
export default function CourseTeachingPanel(props: { courseTeaching: TeachCourseState }) {
    const classes = useStyles();
    const [storeState, setStore] = React.useState(store.state);
    const [normalPercentage, setNormalPercentage] = React.useState(50);
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
            <ExpansionPanelDetails className={classes.panel}>
                <div>
                    <Typography id="continuous-slider" gutterBottom>
                        平时分数占比 {normalPercentage} %
                    </Typography>
                    <Slider value={normalPercentage} step={5} onChange={(e, new_value) => {
                        setNormalPercentage(new_value as number)
                    }} aria-labelledby="continuous-slider"/>
                    <Button color="primary" onClick={(e) => {
                        store.state.courseSelections.giveFinalGrade(props.courseTeaching.id, normalPercentage);
                    }}>
                        确定最终成绩
                    </Button>
                </div>
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
                                                        store.state.courseSelections.put({
                                                            ...courseSelection,
                                                            regular_grade: parseInt(e.target.value)
                                                        })
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
                                                        store.state.courseSelections.put({
                                                            ...courseSelection,
                                                            exam_grade: parseInt(e.target.value)
                                                        })
                                                    }}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {courseSelection.final_grade}
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
