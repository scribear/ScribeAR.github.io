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
import getWordList from './phraseList';
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
let pushed_wordList_name;
// let pushed_option;
let wordList = "";

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
  const originalDispatch = useDispatch();
  const dispatch = (action) => {
    if (typeof action === 'function') {
      return action(originalDispatch);
    }
    return originalDispatch(action);
  };
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

  // // Get the contents of a file from the GitHub repository
  // async function getFileContent(filename, repo, owner, branch, token) {
  //   const response = await axios.get(
  //       `https://api.github.com/repos/${owner}/${repo}/contents/${filename}?ref=${branch}`,
  //       { headers: { Authorization: `Token ${token}` } }
  //   );
  //   const contentBase64 = response.data.content;
  //   const content = atob(contentBase64);
  //   return content;
  // }

  async function getFileContent(filename, repo, owner, branch) {
    console.log(filename)
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filename}?ref=${branch}`
    );
  
    console.log('Response:', response);  // Log the complete response
  
    if (response.data && response.data.content) {
      let contentBase64 = response.data.content;
      // Replace line breaks before decoding
      contentBase64 = contentBase64.replace(/\n/g, '');
      // Decode the content
      try {
        const content = atob(contentBase64);
        return content;
      } catch (error) {
        console.error('Failed to decode the content: ', error);
      }
    } else {
      console.error('Content not found in the response');
    }
  }  
  
  // Check if the file exists in the GitHub repository
  async function checkFileExists(filename, repo, owner, branch) {
    try {
      await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/contents/${filename}?ref=${branch}`
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
  
  interface TreeItem {
    path?: string;
    type?: string;
    [key: string]: any;
  }    
  
  async function getFileNames(owner, repo, branch) {
    // Get the SHA of the latest commit on the branch
    const latestCommitResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`
    );
    const latestCommitSha = latestCommitResponse.data.object.sha;
    
    // Get the tree associated with the commit SHA, setting recursive to 1 to get all files
    const treeResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${latestCommitSha}?recursive=1`
    );
    const tree = treeResponse.data;
  
    // Create an array to store the file names
    let fileNames: string[] = [];
    
    // Loop through the tree's contents and add the path of each file to the array
    tree.tree.forEach((item: TreeItem) => {
      if (item.type === "blob" && item.path) { // blob type means it's a file and path is not undefined
        fileNames.push(item.path);
      }
    });    
  
    // Join all file names with a break line
    const fileNamesStr = fileNames.join("\n");
  
    // Return the file names
    return fileNamesStr;
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
          <input type="text" id="fileName_ScribeAR" placeholder="File Name" style="width: 300px;height: 50px;font-size: 20px;">
          <div id="fileNamesDiv"></div>
        </div>
        <div id="customDiv" style="display: none;">
          <input type="text" id="fileName" placeholder="File Name" style="width: 300px;height: 50px;font-size: 20px;"><br><br>
          <input type="text" id="owner" placeholder="GitHub Owner" style="width: 300px;height: 50px;font-size: 20px;"><br><br>
          <input type="text" id="repo" placeholder="Repository" style="width: 300px;height: 50px;font-size: 20px;"><br><br>
          <input type="text" id="branch" placeholder="Branch" style="width: 300px;height: 50px;font-size: 20px;"><br><br>
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
          return { action: selectedOption, fileName_ScribeAR: (document.getElementById('fileName_ScribeAR') as HTMLInputElement).value };
        } else if (selectedOption === 'custom') {
          return {
            action: selectedOption,
            fileName: (document.getElementById('fileName') as HTMLInputElement).value,
            owner: (document.getElementById('owner') as HTMLInputElement).value,
            repo: (document.getElementById('repo') as HTMLInputElement).value,
            branch: (document.getElementById('branch') as HTMLInputElement).value,
            // token: (document.getElementById('token') as HTMLInputElement).value,
          };
        }
      },
      didOpen: async () => {
        const manualRadio = document.getElementById('manual') as HTMLInputElement;
        const scribeARRadio = document.getElementById('scribeAR') as HTMLInputElement;
        const customRadio = document.getElementById('custom') as HTMLInputElement;
        const manualDiv = document.getElementById('manualDiv');
        const scribeARDiv = document.getElementById('scribeARDiv');
        const customDiv = document.getElementById('customDiv');
        const fileNamesDiv = document.getElementById('fileNamesDiv');
      
        // Function to update the file names in the DOM
        const updateFileNames = (fileNames) => {
          if (!fileNamesDiv) {
            console.error('Cannot find an HTML element with ID "fileNamesDiv". Make sure it exists in your document.');
            return;
          }
      
          // Clear previous file names
          fileNamesDiv.innerHTML = '';
      
          // Split the fileNames string into an array using '\n' as the separator
          let fileNamesArray = fileNames.split('\n');
          // Filter the array to only include files that end with '.txt'
          let txtFilesArray = fileNamesArray.filter(name => name.endsWith('.txt'));
          // Create a paragraph for each file name and append it to the div
          for (const name of txtFilesArray) {
            const p = document.createElement('p');
            p.textContent = name;
            fileNamesDiv.appendChild(p);
          }
        }
      
        // If the scribeAR option is initially checked, we get the file names immediately
        if(scribeARRadio && scribeARRadio.checked) {
          // const fileNames = await getFileNames('JoniLi99', 'DomainWordExtractor', 'main');
          const fileNames = await getFileNames('scribear', 'Phrases', 'main');
          // console.log(fileNames)
          updateFileNames(fileNames);
        }
      
        if(manualRadio && manualDiv && scribeARDiv && customDiv) {
          manualRadio.addEventListener('change', () => {
            manualDiv.style.display = 'block';
            scribeARDiv.style.display = 'none';
            customDiv.style.display = 'none';
          });
        }
      
        if(scribeARRadio && manualDiv && scribeARDiv && customDiv) {
          scribeARRadio.addEventListener('change', async () => {
            manualDiv.style.display = 'none';
            scribeARDiv.style.display = 'block';
            customDiv.style.display = 'none';
            // const fileNames = await getFileNames('JoniLi99', 'DomainWordExtractor', 'main');
            const fileNames = await getFileNames('scribear', 'Phrases', 'main');
            // console.log(fileNames)
            updateFileNames(fileNames);
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
            const fileName_ScribeAR = result.value.fileName_ScribeAR;
            // const owner_ScribeAR = "JoniLi99";
            const owner_ScribeAR = "scribear";
            // const repo_ScribeAR = "DomainWordExtractor";
            const repo_ScribeAR = "Phrases";
            const branch_ScribeAR = "main";
            // const token_ScribeAR = "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";
            console.log(fileName_ScribeAR)
            console.log(owner_ScribeAR)
            console.log(repo_ScribeAR)
            console.log(branch_ScribeAR)
            // console.log(token_ScribeAR)
            // Check if the file exists in the GitHub repository
            checkFileExists(fileName_ScribeAR, repo_ScribeAR, owner_ScribeAR, branch_ScribeAR).then((fileExists) => {
              if (fileExists) {
                // Get the contents of the file
                getFileContent(fileName_ScribeAR, repo_ScribeAR, owner_ScribeAR, branch_ScribeAR).then((fileContent) => {
                  if (fileContent) {
                    console.log(fileContent)
                    const words = fileContent.split('\n');
                    wordList = fileContent;
                    pushed_wordList_name = fileName_ScribeAR;
                    console.log(pushed_wordList_name);
                    // pushed_option = "scribeAR";
                    // pushed_wordList_name = fileName_ScribeAR;
                    // console.log("Word List: ")
                    // console.log(wordList)
                    // to: ChatGPT.AI
                    const phrases = words.map((word, index) => ({
                      id: index.toString(),
                      text: word,
                    }));
        
                    const newPhraseList = {
                      name: fileName_ScribeAR,
                      phrases,
                    };
        
                    // Dispatch the new phrases
                    dispatch({ type: 'ADD_PHRASE_LIST', payload: newPhraseList });
                    dispatch({ type: 'CHANGE_LIST', payload: newPhraseList.phrases });
                  } else {
                    console.error('Failed to fetch file content');
                  }
                }).catch((error) => {
                  console.error('Error fetching file content:', error);
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
          case 'custom':
            // For scribeAR and custom, we need to get the file contents
            // const { fileName, owner, repo, branch, token } = result.value;
            const fileName = result.value.fileName;
            const owner = result.value.owner;
            const repo = result.value.repo;
            const branch = result.value.branch;
            // const token = result.value.token;
            console.log(fileName)
            console.log(owner)
            console.log(repo)
            console.log(branch)
            // console.log(token)
            // Check if the file exists in the GitHub repository
            checkFileExists(fileName, repo, owner, branch).then((fileExists) => {
              if (fileExists) {
                // Get the contents of the file
                getFileContent(fileName, repo, owner, branch).then((fileContent) => {
                  if (fileContent) {
                    console.log(fileContent)
                    const words = fileContent.split('\n');
                    wordList = fileContent;
                    pushed_wordList_name = fileName;
                    console.log(pushed_wordList_name);
                    // pushed_option = "custom";
                    // console.log("Word List: ")
                    // console.log(wordList)
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

                    
                  } else {
                    console.error('Failed to fetch file content');
                  }
                }).catch((error) => {
                  console.error('Error fetching file content:', error);
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

  // console.log("Before RETURN!!!!!!")
  // console.log(wordList)
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
              <PhrasePopUp currentPhraseList={phraseListStatus.phraseListMap.get(phrase)}
              fileContent={wordList}
              pushed_fileName={pushed_wordList_name}/>
            </div>
          )}
        </List>
      </List>
    </div>
  );
}