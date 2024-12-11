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
import HomeIcon from '@mui/icons-material/Home';
import PublicIcon from '@mui/icons-material/Public';


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
let pushed_option;
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
//  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const phraseListStatus = useSelector((state: RootState) => {
    return state.PhraseListReducer as PhraseListStatus;
  });
  // const [state, setState] = React.useState({
  //   currentList: phraseListStatus.currentPhraseList.name,
  //   shouldCollapse: false

  // });

  let phrases: string[] = [];
  for (let entry of Array.from(phraseListStatus.phraseListMap.entries())) {
    phrases.push(entry[0])
  }

  let initialPhraseList: PhraseList = {
    phrases: [],
    name: "empty",
    availableSpace: Infinity,
    pushed_option: "custom" // new
  }
  
  // const handleClickItem = (event) => {
  //   dispatch({ type: 'CHANGE_PHRASE_LIST', payload: phraseListStatus.phraseListMap.get(event.target.innerText) })
  //   let innerText;
  //   if (innerText = phraseListStatus.phraseListMap.get(event.target.innerText)) {
  //     dispatch({ type: 'CHANGE_LIST', payload: innerText.phrases })
  //   }
  //   setState({ ...state, currentList: event.target.innerText})  
  //   setAnchorEl(null);
  // }

  // const toggleDrawer =
  //   (head: string) =>
  //     (event: React.KeyboardEvent | React.MouseEvent) => {
  //       setState({ ...state, shouldCollapse: !state.shouldCollapse })
  //     }

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
   await Swal.fire({
      title: 'Phase Recognition: Import Domain Lists',
      html: `
        <div style="display: flex; justify-content: space-between;">
          <div>
            <input type="radio" id="manual" name="drone" value="manual" checked>
            <button for="manual" type="radio" id="manual" name="drone" value="manual" class="swal2-confirm swal2-styled" style="font-size: 16px;">
              <svg width="24" height="24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path>
              </svg>
              Manual
            </button>
          </div>
          <div>
            <input type="radio" id="scribeAR" name="drone" value="scribeAR">
            <button  for="scribeAR" class="swal2-confirm swal2-styled" style="font-size: 16px;">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px">
                <path d="M0 0h24v24H0V0z" fill="none"/>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79.1-.03.21-.04.31-.04.26 0 .5.1.7.26.51.4.99.82 1.45 1.26.3-.13.61-.26.92-.39-.2-.45-.35-.92-.45-1.4H8v-2h1.01c.03-.32.09-.64.15-.95-.41-.24-.8-.52-1.14-.83-.35-.3-.65-.65-.94-1.02-.05-.07-.09-.13-.13-.2-.04-.06-.06-.13-.09-.2.04-.26.09-.51.14-.77H8V7h2V6h2v1h2V6h2v1h.13c.04.26.1.52.14.77-.03.07-.05.14-.09.2-.04.07-.08.14-.13.20-.28.37-.59.73-.94 1.02-.34.31-.73.59-1.14.83.07.31.12.63.15.95H16v2h-1.07c-.1.48-.25.95-.45 1.4.31.13.62.26.92.39.46-.43.94-.86 1.45-1.26.2-.16.44-.26.7-.26.1 0 .2.01.31.04.13.58.21 1.17.21 1.79 0 4.08-3.05 7.44-7 7.93z"/>
              </svg>
              ScribeAR Domain Lists
            </button>
          </div>
          <div>
            <input type="radio" id="custom" name="drone" value="custom">
            <button  for="custom" class="swal2-confirm swal2-styled" style="font-size: 16px;">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px">
                <path d="M0 0h24v24H0V0z" fill="none"/>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79.1-.03.21-.04.31-.04.26 0 .5.1.7.26.51.4.99.82 1.45 1.26.3-.13.61-.26.92-.39-.2-.45-.35-.92-.45-1.4H8v-2h1.01c.03-.32.09-.64.15-.95-.41-.24-.8-.52-1.14-.83-.35-.3-.65-.65-.94-1.02-.05-.07-.09-.13-.13-.2-.04-.06-.06-.13-.09-.2.04-.26.09-.51.14-.77H8V7h2V6h2v1h2V6h2v1h.13c.04.26.1.52.14.77-.03.07-.05.14-.09.2-.04.07-.08.14-.13.20-.28.37-.59.73-.94 1.02-.34.31-.73.59-1.14.83.07.31.12.63.15.95H16v2h-1.07c-.1.48-.25.95-.45 1.4.31.13.62.26.92.39.46-.43.94-.86 1.45-1.26.2-.16.44-.26.7-.26.1 0 .2.01.31.04.13.58.21 1.17.21 1.79 0 4.08-3.05 7.44-7 7.93z"/>
              </svg>
              Custom Domain Lists
            </button>
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
            console.log(pushed_option)
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
                    pushed_option = "scribeAR";
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
                      pushed_option,
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
                    pushed_option = "scribeAR";
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
                      pushed_option,
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
    return (
      <div>
        <List
          sx={{ width: { xs: '90vw', sm: '50vw', md: '30vw', lg: '20vw' }, bgcolor: 'background.paper' }}
          component="div"
          aria-labelledby="nested-list-subheader"
        >
          <ListItem sx={{ pl: 4, mb: 1 }}>
            <ListItemText primary={"My Phrase Lists"} />
            <IconButton onClick={clickAddList}>
              <AddIcon />
            </IconButton>
          </ListItem>
          <List component="div" disablePadding>
            {phrases.map((phrase: string, index) => {
              const currentPhraseOption = phraseListStatus.phraseListMap.get(phrase)?.pushed_option;
              const phraseListObject = phraseListStatus.phraseListMap.get(phrase);
              console.log("PhraseList Object: ", phraseListObject);
              console.log(pushed_option)
              console.log(currentPhraseOption)
              
              return (
                <div key={index}>
                  <Divider />
                  <PhrasePopUp 
                    currentPhraseList={phraseListStatus.phraseListMap.get(phrase)}
                    fileContent={wordList}
                    pushed_fileName={pushed_wordList_name}
                  />
                  {currentPhraseOption === 'scribeAR' ? 
                    <IconButton>
                      <PublicIcon />
                    </IconButton> :
                    <IconButton>
                      <HomeIcon />
                    </IconButton>
                  }
                </div>
              );
            })}
          </List>
        </List>
      </div>
  );   
}



// <label for="manual">Manual</label>

// <label for="scribeAR">ScribeAR Domain Lists</label>

// <label for="custom">Custom Domain Lists</label>