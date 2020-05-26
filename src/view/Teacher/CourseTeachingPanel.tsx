import React, {useEffect} from "react";

import {CourseState} from "../../store/course";
import {
    createStyles,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    Theme,
    Typography
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
export default function CourseTeachingPanel(props: { course?: CourseState }) {
    const classes = useStyles();
    return (
        <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>} aria-controls="panel-content" id="panel1a-header">
                <Typography className={classes.heading}>{props.course?.name}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails/>
        </ExpansionPanel>
    )
}
