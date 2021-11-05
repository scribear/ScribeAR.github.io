import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Collapse from '@mui/material/Collapse';
import ListItemButton from '@mui/material/ListItemButton';
import Swal from 'sweetalert2';
import Divider from '@mui/material/Divider';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import './phrase.css'
import IconButton from "@mui/material/IconButton";
import ListItemText from '@mui/material/ListItemText'; import Button from '@mui/material/Button';
import Theme from '../../theme'
import { RootState, ControlStatus, PhraseListStatus, PhraseList } from '../../../redux/types';
import { useDispatch, useSelector } from 'react-redux';



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
    const phraseList = useSelector((state: RootState) => {
        return state.PhraseListReducer.currentPhraseList as PhraseList;
    });
    const open = Boolean(anchorEl);
    const [state, setState] = React.useState({
        listPhrases: phraseList.phrases,
        currentList: phraseList.name,
        shouldCollapse: true
    });

    let phrases: string[] = Array();
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
    let currentPhrases: string[] = Array();
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
            text: "Add phrases",
            input: 'text',
            returnFocus: true,
            showCancelButton: true,
            confirmButtonText: 'Add Another',
            cancelButtonText: 'Done',
        }).then((result) => {
            if (result.isConfirmed) {
                phraseList.phrases.push(result.value)
                setState({ ...state, listPhrases:  phraseList.phrases})
                dispatch({type: "EDIT_PHRASE_LIST", payload: phraseList})
                dispatch({type: "CHANGE_LIST", payload: phraseList})
                clickAddList()
            } else if (result.isDismissed) {
                
            }
            
        });
    }

    if (phraseList.availableSpace == -1) {
        return ( null)
    }
    return (
        <div>
            <List
                sx={{ width: '20vw', bgcolor: 'background.paper' }}
                component="nav"
                aria-labelledby="nested-list-subheader"
            >
                <ListItem>
                    <ListItemText primary={"Current List: " + phraseList.name} />
                    <IconButton onClick={toggleDrawer("stt")} >
            {state.shouldCollapse ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
                </ListItem>

                <Collapse in={state.shouldCollapse} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {phraseList.phrases.map((phrase: string, index) =>
                            <div>
                                <Divider />
                                <ListItemButton>
                                    <ListItemText primary={phrase} />
                                </ListItemButton>

                            </div>
                        )}
                    </List>
                </Collapse>
            </List>
            <Button sx={{ pl: 4 }}>
                <ListItemText primary="Add Phrases" onClick={clickAddList} />
            </Button>
        </div>
    );
}


