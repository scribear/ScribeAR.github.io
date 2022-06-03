import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ListItem from '@mui/material/ListItem';
import Visualizing from './visualizing'
import EqualizerIcon from '@mui/icons-material/Equalizer';

export default function VisualizationMenu(props) {

    return (
        <div>
            {props.listItemHeader("Visualization", "visualization", EqualizerIcon)}

            <Collapse in={props.open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItem sx={{ pl: 4 }}>
                        <ListItemText primary="Visualizing" />
                        <Visualizing />
                    </ListItem>
                        {/* <PauseCircleFilledIcon />
                        <PlayCircleFilledIcon />
                        <MoreHorizIcon />
                        <RadioButtonUncheckedOutlinedIcon fontSize="large"/> */}
                    {/* <ListItem sx={{ pl: 4 }}>
                        <ListItemText primary="Design" />
                    </ListItem> */}
                </List>
            </Collapse>
        </div>
    );
}