import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import Phrase from './addPhrase'
import MenuIcon from '@mui/icons-material/Menu';
import { styled, alpha } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Collapse from '@mui/material/Collapse';
import ListItemButton from '@mui/material/ListItemButton';
import Swal from 'sweetalert2';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import './phrase.css'
import IconButton from "@mui/material/IconButton";
import ListItemText from '@mui/material/ListItemText'; import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Theme from '../../theme'
import { RootState, ControlStatus, PhraseListStatus, PhraseList } from '../../../redux/types';
import { useDispatch, useSelector } from 'react-redux';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';


// export default function TemporaryDrawer(props) {
//     const [state, setState] = React.useState({
//         isOpen: false
//     });
//     const toggleDrawer =
//         (open: boolean) =>
//             (event: React.MouseEvent) => {
//                 setState({ ...state, isOpen: open });
//             };
//     return (
//         <div>
//             <IconButton
//                 onClick={toggleDrawer(true)}
//             >
//                 <MenuIcon color="primary" />
//             </IconButton>
//             <Drawer
//                 open={state.isOpen}
//                 onClose={toggleDrawer(false)}
//             >
//                 <Phrase isRecording={props.isRecording} />
//             </Drawer>
//         </div>
//     )
// }



/* todo:
  1   Make language bar a fixed height so that it can only display ~8 languages 
      and not take up the whole screen
  2   Change language lists to a 2d array that so we can display the countries name
      and save the shortened title in RootState
*/

export default function CustomizedMenus() {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const phraseListStatus = useSelector((state: RootState) => {
    return state.PhraseListReducer as PhraseListStatus;
  });
  const [state, setState] = React.useState({
    currentList: phraseListStatus.currentPhraseList.name,
    shouldCollapse: true
  });

  let phrases: string[] = Array();
  for (let entry of Array.from(phraseListStatus.phraseListMap.entries())) {
    phrases.push(entry[0])
  }
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  let initialPhraseList: PhraseList = {
    phrases: [],
    name: "empty",
    availableSpace: 2000
  }
  
  const handleClickItem = (event) => {
    dispatch({ type: 'CHANGE_PHRASE_LIST', payload: phraseListStatus.phraseListMap.get(event.target.innerText) })
    dispatch({ type: 'CHANGE_LIST', payload: phraseListStatus.phraseListMap.get(event.target.innerText)?.phrases })
    setState({ ...state, currentList: event.target.innerText})
    
    setAnchorEl(null);
  }
  const changePhraseList = () => {
    setAnchorEl(null);
  }
  const toggleDrawer =
    (head: string) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        setState({ ...state, shouldCollapse: !state.shouldCollapse })
      }
  const clickAddList = () => {
    Swal.fire({
      customClass: {
        container: 'swal2-container',
      },
      text: "Make a title for your list of phrases",
      input: 'text',
      returnFocus: true,
      showCancelButton: true        
  }).then((result) => {
      if (result.value) {
      initialPhraseList.name = result.value
      dispatch({ type: 'ADD_PHRASE_LIST', payload: initialPhraseList })
      dispatch({ type: 'CHANGE_LIST', payload: initialPhraseList.phrases })
      }
  });
  }
  const { myTheme } = Theme()


  return (
    <div>
      <List
        sx={{ width: '20vw', bgcolor: 'background.paper' }}
        component="nav"
        aria-labelledby="nested-list-subheader"
      >
        <ListItem>
          <ListItemText primary={"My Phrase Lists"} />
          <IconButton onClick={toggleDrawer("stt")} >
            {state.shouldCollapse ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </ListItem>
        <Collapse in={state.shouldCollapse} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
          {phrases.map((phrase: string, index) =>
              <ListItemButton id = {phrase} onClick={handleClickItem}>
                <ListItemText primary={phrase} />
              </ListItemButton>
          )}
          </List>
        </Collapse>
        </List>      
      <Button sx={{ pl: 4 }}>
        <ListItemText primary="Add Phrase List" onClick={clickAddList}/>
      </Button>
    </div>
  );
}


