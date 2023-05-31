import * as React from 'react';
import { List, ListItem, Divider, AddIcon, IconButton, ListItemText } from '../../../../muiImports'; 
import Swal from 'sweetalert2';
import PhrasePopUp from './phraseList';
import './phrase.css'
import { RootState, PhraseListStatus, PhraseList } from '../../../../react-redux&middleware/redux/typesImports';
import { useDispatch, useSelector } from 'react-redux';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';

/* todo:
  1   Make language bar a fixed height so that it can only display ~8 languages 
      and not take up the whole screen
  2   Change language lists to a 2d array that so we can display the countries name
      and save the shortened title in RootState
*/

// Initialize SweetAlert2
const MySwal = withReactContent(Swal);

export default function PhraseListAdd(props) {
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
    let innerText;
    if (innerText = phraseListStatus.phraseListMap.get(event.target.innerText)) {
      dispatch({ type: 'CHANGE_LIST', payload: innerText.phrases })
    }
    setState({ ...state, currentList: event.target.innerText})  
    setAnchorEl(null);
  }

  const toggleDrawer =
    (head: string) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        setState({ ...state, shouldCollapse: !state.shouldCollapse })
      }

  const clickAddList = async () => {
    const { value: formValues } = await MySwal.fire({
      title: 'Input GitHub Information',
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="File Name">' +
        '<input id="swal-input2" class="swal2-input" placeholder="GitHub Owner">' +
        '<input id="swal-input3" class="swal2-input" placeholder="Repository">' +
        '<input id="swal-input4" class="swal2-input" placeholder="Branch">' +
        '<input id="swal-input5" class="swal2-input" placeholder="GitHub Token">',
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById('swal-input1').value,
          document.getElementById('swal-input2').value,
          document.getElementById('swal-input3').value,
          document.getElementById('swal-input4').value,
          document.getElementById('swal-input5').value,
        ]
      }
    })

    if (formValues) {
      const [fileName, owner, repo, branch, token] = formValues;

      // Fetch file from GitHub
      const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/${fileName}?ref=${branch}`, {
        headers: { 'Authorization': `token ${token}` },
      });

      const fileContent = atob(response.data.content);
      const words = fileContent.split('\n');

      const newList = {name: fileName, phrases: words, availableSpace: 10 - words.length}
      dispatch({ type: 'ADD_PHRASE_LIST', payload: newList })
      dispatch({ type: 'CHANGE_LIST', payload: newList.phrases })
    }

  // const clickAddList = () => {
  //   Swal.fire({
  //     customClass: {
  //       container: 'swal2-container',
  //     },
  //     text: "Make a title for your list of phrases",
  //     input: 'text',
  //     returnFocus: true,
  //     showCancelButton: true
  //   }).then((result) => {
  //     if (result.value) {
  //       initialPhraseList.name = result.value
  //       dispatch({ type: 'ADD_PHRASE_LIST', payload: initialPhraseList })
  //       dispatch({ type: 'CHANGE_LIST', payload: initialPhraseList.phrases })
  //     }
  //   });
  // }

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
              <PhrasePopUp currentPhraseList={phraseListStatus.phraseListMap.get(phrase)}/>
            </div>
          )}
        </List>
      </List>
    </div>
  );
}