import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Swal from 'sweetalert2';
import Divider from '@mui/material/Divider';
import AddIcon from '@mui/icons-material/Add';
import PhrasePopUp from './phraseList';
import './phrase.css'
import IconButton from "@mui/material/IconButton";
import ListItemText from '@mui/material/ListItemText'; 
import { RootState, PhraseListStatus, PhraseList } from '../../../redux/types';
import { useDispatch, useSelector } from 'react-redux';

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
    shouldCollapse: false

  });

  let phrases: string[] = Array();
  for (let entry of Array.from(phraseListStatus.phraseListMap.entries())) {
    phrases.push(entry[0])
  }

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

  return (
    <div>

      <List
        sx={{ width: '20vw', bgcolor: 'background.paper' }}
        component="div"
        aria-labelledby="nested-list-subheader"
      >
        <ListItem sx={{ pl: 4, mb: 1 }}>
          <ListItemText primary={"My Phrase Lists"} />
          <IconButton onClick={clickAddList} >
            <AddIcon />
          </IconButton>
        </ListItem>
        <List component="div" disablePadding>
          {phrases.map((phrase: string, index) =>
            <div>
              <Divider />
              <PhrasePopUp
                currentPhraseList={phraseListStatus.phraseListMap.get(phrase)}
              />
            </div>
          )}
        </List>
      </List>
    </div>
  );
}


