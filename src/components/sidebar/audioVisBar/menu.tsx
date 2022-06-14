import { List, ListItemText, Collapse, ListItem, EqualizerIcon } from '../../../muiImports'
import Visualizing from './visualizing'
import ShowFrequency from './showFrequency'

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
                    <ListItem sx={{ pl: 4 }}>
                        <ListItemText primary="Show Frequency" />
                        <ShowFrequency />
                    </ListItem>
                </List>
            </Collapse>
        </div>
    );
}