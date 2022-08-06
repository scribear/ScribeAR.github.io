import { List, ListItemText, Collapse, ListItem, EqualizerIcon } from '../../../muiImports'
import ShowFrequency from './showFrequency'
import ShowTimeData from './showTimeData'

export default function VisualizationMenu(props) {

    return (
        <div>
            {props.listItemHeader("Visualization", "visualization", EqualizerIcon)}

            <Collapse in={props.open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItem sx={{ pl: 4 }}>
                        <ListItemText primary="Show Frequency" />
                        <ShowFrequency />
                    </ListItem>
                    {/* <ListItem sx={{ pl: 4 }}>
                        <ListItemText primary="Show Labels" />
                        <ShowLabels />
                    </ListItem> */}
                    <ListItem sx={{ pl: 4 }}>
                        <ListItemText primary="Show Time Data" />
                        <ShowTimeData />
                    </ListItem>
                </List>
            </Collapse>
        </div>
    );
}