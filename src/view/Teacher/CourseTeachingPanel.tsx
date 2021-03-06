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
import {Bar} from "react-chartjs-2";

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
        },
        maxHeight: {
            maxHeight: '400px'
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

    function studentCountInRange(min: number, max: number) {
        let result = 0;
        for (let value of storeState.courseSelections.state.values()) {
            if (value.teach_course_id === props.courseTeaching.id
                && value.final_grade !== undefined
                && value.final_grade !== null
                && min <= value.final_grade && value.final_grade < max) {
                result += 1;
            }
        }
        return result;
    }

    const data = {
        labels: ['<60', '60-70', '70-80', '80-90', '90-100'],
        datasets: [{
            label: '成绩分布',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: [
                studentCountInRange(0, 60),
                studentCountInRange(60, 70),
                studentCountInRange(70, 80),
                studentCountInRange(80, 90),
                studentCountInRange(90, 101),
            ]
        }
        ]
    };

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
                <div className={classes.maxHeight}>
                    <Bar data={data}
                         width={600}
                         height={400}
                         options={{
                             maintainAspectRatio: false
                         }}></Bar>
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
