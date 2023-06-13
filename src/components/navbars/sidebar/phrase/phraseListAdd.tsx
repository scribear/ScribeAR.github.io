import * as React from 'react';
import { List, ListItem, Divider, AddIcon, IconButton, ListItemText } from '../../../../muiImports'; 
import Swal from 'sweetalert2';
import PhrasePopUp from './phraseList';
import './phrase.css'
import { RootState, PhraseListStatus, PhraseList } from '../../../../react-redux&middleware/redux/typesImports';
import { useDispatch, useSelector } from 'react-redux';
// import { useDispatch as useReduxDispatch, useSelector } from 'react-redux';
import axios, { AxiosError } from 'axios';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

/* todo:
  1   Make language bar a fixed height so that it can only display ~8 languages 
      and not take up the whole screen
  2   Change language lists to a 2d array that so we can display the countries name
      and save the shortened title in RootState
*/

// type AppDispatch = ThunkDispatch<RootState, unknown, Action<string>>

// export const useDispatch = () => useReduxDispatch<AppDispatch>()

// const store = createStore(
//   rootReducer,
//   applyMiddleware(thunkMiddleware)
// );

// export default store;

// This is the action to add a new phrase list
export const addPhraseList = (newList: PhraseList) => {
  return {
    type: 'ADD_PHRASE_LIST',
    payload: newList
  };
}

// This is the action to change the current list
export const changeList = (phrases: string[]) => {
  return {
    type: 'CHANGE_LIST',
    payload: phrases
  };
}

// // This is the action creator
// function addPhraseListAndChange(newList) {
//   return async function(dispatch: ThunkDispatch<any, any, any>) {
//     await dispatch({ type: 'ADD_PHRASE_LIST', payload: newList });
//     dispatch({ type: 'CHANGE_LIST', payload: newList.phrases });
//   }
// }

// This is the action creator
export const addPhraseListAndChange = (newList: PhraseList) => {
  return async (dispatch: ThunkDispatch<RootState, unknown, Action<string>>) => {
    await dispatch({ type: 'ADD_PHRASE_LIST', payload: newList });
    dispatch({ type: 'CHANGE_LIST', payload: newList.phrases });
  }
}

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
    availableSpace: Infinity
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

  // Get the contents of a file from the GitHub repository
  async function getFileContent(filename, repo, owner, branch, token) {
    const response = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/contents/${filename}?ref=${branch}`,
        { headers: { Authorization: `Token ${token}` } }
    );
    const contentBase64 = response.data.content;
    const content = atob(contentBase64);
    return content;
  }

  // Check if the file exists in the GitHub repository
  async function checkFileExists(filename, repo, owner, branch, token) {
    try {
        await axios.get(
            `https://api.github.com/repos/${owner}/${repo}/contents/${filename}?ref=${branch}`,
            { headers: { Authorization: `Token ${token}` } }
        );
        return true;
    } catch (error) {
        // We cast the error to AxiosError
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 404) {
            return false;
        }
        throw error;
    }
  }

  const clickAddList = async () => {
    const result = await Swal.fire({
      title: 'Phase Recognition: Import Domain Lists',
      html: `
        <div style="display: flex; justify-content: space-between;">
          <div>
            <input type="radio" id="manual" name="drone" value="manual" checked>
            <label for="manual">Manual</label>
          </div>
          <div>
            <input type="radio" id="scribeAR" name="drone" value="scribeAR">
            <label for="scribeAR">ScribeAR Domain Lists</label>
          </div>
          <div>
            <input type="radio" id="custom" name="drone" value="custom">
            <label for="custom">Custom Domain Lists</label>
          </div>
        </div>
        <br><br>
        <div id="manualDiv" style="display: block;">
          <input type="text" id="listTitle" placeholder="Make a title for your list of phrases" style="width: 400px;height: 50px;font-size: 20px;">
        </div>
        <div id="scribeARDiv" style="display: none;">
          <input type="text" id="fileName" placeholder="File Name" style="width: 300px;height: 50px;font-size: 20px;">
        </div>
        <div id="customDiv" style="display: none;">
          <input type="text" id="fileName" placeholder="File Name" style="width: 300px;height: 50px;font-size: 20px;"><br><br>
          <input type="text" id="owner" placeholder="GitHub Owner" style="width: 300px;height: 50px;font-size: 20px;"><br><br>
          <input type="text" id="repo" placeholder="Repository" style="width: 300px;height: 50px;font-size: 20px;"><br><br>
          <input type="text" id="branch" placeholder="Branch" style="width: 300px;height: 50px;font-size: 20px;"><br><br>
          <input type="text" id="token" placeholder="GitHub Token" style="width: 300px;height: 50px;font-size: 20px;">
        </div>
      `,
      focusConfirm: false,
      preConfirm: () => {
        // const selectedOption = document.querySelector('input[name="drone"]:checked').value;
        let selectedOption;
        const radioChecked = document.querySelector('input[name="drone"]:checked');
        if (radioChecked) {
          selectedOption = (radioChecked as HTMLInputElement).value;
        }
        if (selectedOption === 'manual') {
          return { action: selectedOption, listTitle: (document.getElementById('listTitle') as HTMLInputElement).value };
        } else if (selectedOption === 'scribeAR') {
          return { action: selectedOption, fileName: (document.getElementById('fileName') as HTMLInputElement).value };
        } else if (selectedOption === 'custom') {
          return {
            action: selectedOption,
            fileName: (document.getElementById('fileName') as HTMLInputElement).value,
            owner: (document.getElementById('owner') as HTMLInputElement).value,
            repo: (document.getElementById('repo') as HTMLInputElement).value,
            branch: (document.getElementById('branch') as HTMLInputElement).value,
            token: (document.getElementById('token') as HTMLInputElement).value,
          };
        }
      },
      didOpen: () => {
        const manualRadio = document.getElementById('manual');
        const scribeARRadio = document.getElementById('scribeAR');
        const customRadio = document.getElementById('custom');
        const manualDiv = document.getElementById('manualDiv');
        const scribeARDiv = document.getElementById('scribeARDiv');
        const customDiv = document.getElementById('customDiv');
      
        if(manualRadio && manualDiv && scribeARDiv && customDiv) {
          manualRadio.addEventListener('change', () => {
            manualDiv.style.display = 'block';
            scribeARDiv.style.display = 'none';
            customDiv.style.display = 'none';
          });
        }
      
        if(scribeARRadio && manualDiv && scribeARDiv && customDiv) {
          scribeARRadio.addEventListener('change', () => {
            manualDiv.style.display = 'none';
            scribeARDiv.style.display = 'block';
            customDiv.style.display = 'none';
          });
        }
      
        if(customRadio && manualDiv && scribeARDiv && customDiv) {
          customRadio.addEventListener('change', () => {
            manualDiv.style.display = 'none';
            scribeARDiv.style.display = 'none';
            customDiv.style.display = 'block';
          });
        }
      }      
    }).then((result) => {
      // Check if result is not dismissed
      if (result.isConfirmed) {
        switch (result?.value?.action) {
          case 'manual':
            initialPhraseList.name = result?.value?.listTitle || '';
            dispatch({ type: 'ADD_PHRASE_LIST', payload: initialPhraseList });
            dispatch({ type: 'CHANGE_LIST', payload: initialPhraseList.phrases });
            break;
          case 'scribeAR':
          case 'custom':
            // For scribeAR and custom, we need to get the file contents
            const { fileName, owner, repo, branch, token } = result.value;
            // Check if the file exists in the GitHub repository
            checkFileExists(fileName, repo, owner, branch, token).then((fileExists) => {
              if (fileExists) {
                // Get the contents of the file
                getFileContent(fileName, repo, owner, branch, token).then((fileContent) => {
                  const words = fileContent.split('\n');
                  // to: ChatGPT.AI
                  const phrases = words.map((word, index) => ({
                    id: index.toString(),
                    text: word,
                  }));
      
                  const newPhraseList = {
                    name: fileName,
                    phrases,
                  };
      
                  // Dispatch the new phrases
                  dispatch({ type: 'ADD_PHRASE_LIST', payload: newPhraseList });
                  dispatch({ type: 'CHANGE_LIST', payload: newPhraseList.phrases });
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'File not found!',
                });
              }
            });
            break;
          default:
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Invalid option selected!',
            });
        }
      }
    });
  };
  

  /** LAST CORRECT ONE */
  // const clickAddList = async () => {
  //   const { value: action } = await Swal.fire({
  //     title: 'Phase Recognition: Import Domain Lists',
  //     input: 'radio',
  //     inputOptions: {
  //       'manual': 'Manual',
  //       'scribeAR': 'ScribeAR Domain Lists',
  //       'custom': 'Custom Domain Lists'
  //     },
  //     inputValue: 'manual',
  //     showCancelButton: true
  //   })
  
  //   switch (action) {
  //     case 'manual':
  //       Swal.fire({
  //         customClass: {
  //           container: 'swal2-container',
  //         },
  //         text: "Make a title for your list of phrases",
  //         input: 'text',
  //         returnFocus: true,
  //         showCancelButton: true
  //       }).then((result) => {
  //         if (result.value) {
  //           initialPhraseList.name = result.value
  //           dispatch({ type: 'ADD_PHRASE_LIST', payload: initialPhraseList })
  //           dispatch({ type: 'CHANGE_LIST', payload: initialPhraseList.phrases })
  //         }
  //       });
  //       break;
  
  //     case 'scribeAR':
  //     case 'custom':
  //       const { value: formValues } = await Swal.fire({
  //         title: action === 'scribeAR' ? 'ScribeAR Domain Lists' : 'Custom Domain Lists',
  //         html:
  //           '<input id="swal-input1" class="swal2-input" placeholder="File Name">' +
  //           (action === 'custom' ?
  //             '<input id="swal-input2" class="swal2-input" placeholder="GitHub Owner">' +
  //             '<input id="swal-input3" class="swal2-input" placeholder="Repository">' +
  //             '<input id="swal-input4" class="swal2-input" placeholder="Branch">' +
  //             '<input id="swal-input5" class="swal2-input" placeholder="GitHub Token">' : ''),
  //         focusConfirm: false,
  //         preConfirm: () => {
  //           if (action === 'custom') {
  //             return [
  //               (document.getElementById('swal-input1') as HTMLInputElement).value,
  //               (document.getElementById('swal-input2') as HTMLInputElement).value,
  //               (document.getElementById('swal-input3') as HTMLInputElement).value,
  //               (document.getElementById('swal-input4') as HTMLInputElement).value,
  //               (document.getElementById('swal-input5') as HTMLInputElement).value,
  //             ]
  //           } else {
  //             return [
  //               (document.getElementById('swal-input1') as HTMLInputElement).value,
  //               "JoniLi99",
  //               "DomainWordExtractor",
  //               "main",
  //               "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",
  //             ]
  //           }
  //         }
  //       })
  
  //       if (formValues) {
  //         const [fileName, owner, repo, branch, token] = formValues;
  
  //         // Check if the file exists in the GitHub repository
  //         const fileExists = await checkFileExists(fileName, repo, owner, branch, token);
  //         if (fileExists) {
  //           // Get the contents of the file
  //           const fileContent = await getFileContent(fileName, repo, owner, branch, token);
  
  //           console.log(fileContent)
  //           const words = fileContent.split('\n');
  //           // to: ChatGPT.AI
  //           const phrases = words.map((word, index) => ({
  //             id: index.toString(),
  //             text: word,
  //           }));
  
  //           const newPhraseList = {
  //             name: fileName,
  //             phrases,
  //           };
  
  //           // Dispatch the new phrases
  //           dispatch({ type: 'ADD_PHRASE_LIST', payload: newPhraseList });
  //           dispatch({ type: 'CHANGE_LIST', payload: newPhraseList.phrases });
  //         } else {
  //           Swal.fire({
  //             icon: 'error',
  //             title: 'Oops...',
  //             text: 'File not found!',
  //           });
  //         }
  //       }
  
  //       break;
  //     default:
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Oops...',
  //         text: 'Invalid option selected!',
  //       });
  //   }
  // };
  
  
  /** CORRECT ONE */
  // const clickAddList = async () => {
  //   const { value: formValues } = await Swal.fire({
  //     title: 'Input GitHub Information',
  //     html:
  //       '<input id="swal-input1" class="swal2-input" placeholder="File Name">' +
  //       '<input id="swal-input2" class="swal2-input" placeholder="GitHub Owner">' +
  //       '<input id="swal-input3" class="swal2-input" placeholder="Repository">' +
  //       '<input id="swal-input4" class="swal2-input" placeholder="Branch">' +
  //       '<input id="swal-input5" class="swal2-input" placeholder="GitHub Token">',
  //     focusConfirm: false,
  //     preConfirm: () => {
  //       return [
  //         (document.getElementById('swal-input1') as HTMLInputElement).value,
  //         (document.getElementById('swal-input2') as HTMLInputElement).value,
  //         (document.getElementById('swal-input3') as HTMLInputElement).value,
  //         (document.getElementById('swal-input4') as HTMLInputElement).value,
  //         (document.getElementById('swal-input5') as HTMLInputElement).value,
  //       ]
  //     }
  //   })
  
  //   if (formValues) {
  //     const [fileName, owner, repo, branch, token] = formValues;

  //     // Check if the file exists in the GitHub repository
  //     const fileExists = await checkFileExists(fileName, repo, owner, branch, token);
  //     if (fileExists) {
  //       // Get the contents of the file
  //       const fileContent = await getFileContent(fileName, repo, owner, branch, token);

  //       console.log(fileContent)
  //       const words = fileContent.split('\n');
  //       // const newList = {name: fileName, phrases: words, availableSpace: 10 - words.length}
  //       const newList = {name: fileName, phrases: words, availableSpace: Infinity}
  //       // dispatch({ type: 'ADD_PHRASE_LIST', payload: newList })
  //       // dispatch({ type: 'CHANGE_LIST', payload: newList.phrases })
  //       // Dispatch the actions separately
  //       dispatch(addPhraseList(newList));
  //       dispatch(changeList(newList.phrases));
  //       // dispatch(addPhraseListAndChange(newList)); // Dispatch the combined action
  //     } else {
  //       // Handle the case when the file does not exist
  //       console.error("File does not exist");
  //     }
  //   }
  // };
  
  /** ORIGINAL ONE */
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
            <div key={index}>
              <Divider />
              <PhrasePopUp currentPhraseList={phraseListStatus.phraseListMap.get(phrase)}/>
            </div>
          )}
        </List>
      </List>
    </div>
  );
}


