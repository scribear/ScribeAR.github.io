import * as React from 'react';
import { IconButton,  ListItemText, ListItem, ListItemIcon,  ExpandMore,  ExpandLess,  List,  EqualizerIcon,  DetailsIcon, Divider } from '../../../muiImports'
import DisplayMenu from './display/menu';
import LangMenu from './language/menu';
import PhraseMenu from './phrase/menu';
import VisualizationMenu from './audioVisBar/menu';


export default function SideBar(props) {
  const [state, setState] = React.useState({
    display: false,
    lang: true,
    visualization: false,
    phraseRecognition: false,
  });

  
  const toggleDrawer =
    (head: string) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        setState({ ...state, [head]: !state[head] })
      }
  
  const listItemHeader = (subMenu: string, drawerName: string, Icon) => {
    return (
      <ListItem>
        <ListItemIcon>
          <Icon/>
        </ListItemIcon>
        <ListItemText primary= {subMenu} />
        <IconButton onClick={toggleDrawer(drawerName)} >
          {state[drawerName] ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </ListItem>
    )
  }


  return (
    <div>
      <h2 className="d-table-cell tar2" style={{textAlign: "left", paddingLeft: "20px", transition:'.6s'}}>Menu</h2>
      <List sx={{ width: '20vw', bgcolor: 'background.paper' }} component="nav" aria-labelledby="nested-list-subheader" >
        <LangMenu open={state.lang} isRecording={props.isRecording} listItemHeader={listItemHeader} />
        <Divider/>
        
        <DisplayMenu open={state.display} listItemHeader={listItemHeader} />
        <Divider/>
        
        <PhraseMenu open={state.phraseRecognition} icon={DetailsIcon} listItemHeader={listItemHeader} />
        <Divider/>

        <VisualizationMenu open={state.visualization} icon={EqualizerIcon} listItemHeader={listItemHeader} />
        <Divider/>
      </List>
    </div>
  );
}


