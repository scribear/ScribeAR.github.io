import * as React from 'react';
import { List, ListItem, TextField, Paper, InputBase, Menu, ClearIcon, EditIcon, IconButton, ListItemText } from '../../../../muiImports';
import './phrase.css'
import { PhraseList } from '../../../../react-redux&middleware/redux/typesImports';
import { useDispatch } from 'react-redux';

/* todo:
  1   Make language bar a fixed height so that it can only display ~8 languages 
      and not take up the whole screen
  2   Change language lists to a 2d array that so we can display the countries name
      and save the shortened title in RootState
*/

export default function PhrasePopUp(props) {
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);
    const [state, setState] = React.useState({
        phraseList: props.currentPhraseList as PhraseList,
        currentPhrase: "",
        shouldCollapse: true
    });

    let phrases: string[] = Array();
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);

        let fileName: string = props.pushed_fileName;
        console.log("fileName: ")
        console.log(fileName)
        console.log("state.phraseList.name: ")
        console.log(state.phraseList.name)
        if (fileName == state.phraseList.name) {
            automaticAddList()
        }
    };
    const handleClickX = (head: any) => (event: React.MouseEvent<HTMLElement>) => {
        let listPhrases = state.phraseList.phrases.splice(head, 1);
        dispatch({ type: "EDIT_PHRASE_LIST", payload: listPhrases })
    };
    const handleChange = (event) => {
        setState({ ...state, currentPhrase: event.target.value})  
    }
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleClickPhrase = (event: React.MouseEvent<HTMLElement>) => {
        console.log(event)
    }

    const handleEnter = (event) =>
    {
      if (event.key === 'Enter') {
        console.log(event)
        //   setState({ ...state, currentPhrase: ""})  
        // clickAddList(event)
       
        event.preventDefault();
      }
    }

    const handleAddButtonClick = () => {
        console.log("Add Button Clicked");
        setState({ ...state, currentPhrase: "" });
        clickAddList({ target: { value: state.currentPhrase } });
    }    

    // const clickAddList = (event) => {
    //     if (event.target.value) {
    //         state.phraseList.phrases.push(event.target.value)
    //         // Sort the phrases in alphabetical order
    //         state.phraseList.phrases.sort((a, b) => a.localeCompare(b));
    //         dispatch({ type: "EDIT_PHRASE_LIST", payload: state.phraseList })
    //         dispatch({ type: "CHANGE_LIST", payload: state.phraseList.phrases })
    //     }
    // }
    
    const [additionMessage, setAdditionMessage] = React.useState("");

    const clickAddList = (event) => {
        // Remove spaces and convert to lowercase for comparison
        const newPhrase = event.target.value.replace(/\s+/g, '').toLowerCase();
    
        // Remove spaces and convert existing phrases to lowercase for comparison
        const existingPhrases = state.phraseList.phrases.map(phrase => phrase.replace(/\s+/g, '').toLowerCase());
    
        if (event.target.value && !existingPhrases.includes(newPhrase)) {
            // Add the original phrase as it was entered by the user
            state.phraseList.phrases.push(event.target.value);
    
            // Set the message after adding the word
            setAdditionMessage(`${event.target.value} is successfully added!!!`);
    
            // Sort the phrases in alphabetical order
            state.phraseList.phrases.sort((a, b) => a.localeCompare(b));
    
            // Dispatch to update state
            dispatch({ type: "EDIT_PHRASE_LIST", payload: state.phraseList });
            dispatch({ type: "CHANGE_LIST", payload: state.phraseList.phrases });

            // New: Dispatch action to set pushed_option to 'custom'
            dispatch({ type: "SET_PHRASE_OPTION_TO_CUSTOM", payload: { phraseName: state.phraseList.name } });
        }
    };            

    const automaticAddList = () => {
        // console.log("ADD!YEAH!")
        // Access fileContent here like this:
        let fileContent: string = props.fileContent;
        // console.log(fileContent)
        // console.log(typeof fileContent)
        // console.log("HAHAHAHAHAHAHAHA!")
        if (fileContent.length != 0) {
            // Split the string into an array of words
            let words: string[] = fileContent.split('\n');
            console.log(words)
            // const member_array = ["Joni", "Tiger", "Isaac"]
            for (let i = 0; i < words.length; i++) {
                if(!state.phraseList.phrases.includes(words[i])){
                    state.phraseList.phrases.push(words[i])
                    state.phraseList.phrases.sort((a, b) => a.localeCompare(b));
                    dispatch({ type: "EDIT_PHRASE_LIST", payload: state.phraseList })
                    dispatch({ type: "CHANGE_LIST", payload: state.phraseList.phrases })
                }
            }
        }
    }

    if (state.phraseList.availableSpace == -1) {
        return (null)
    }
    const handleChangePhraseName = (event) => {
        console.log(event)
        let copy = Object.assign({}, state.phraseList);
        copy.name = event.target.value
        setState({ ...state, phraseList:copy})  
        dispatch({ type: 'CHANGE_PHRASE_LIST', payload: state.phraseList })
    }

    const handleCopyToClipboard = () => {
        // Combine all phrases into a single string separated by newlines
        const textToCopy = state.phraseList.phrases.join('\n');
        // Use the Clipboard API to copy the text
        navigator.clipboard.writeText(textToCopy).then(() => {
          // Successful copy
          console.log("Phrases copied to clipboard");
        }).catch(err => {
          // Failed to copy
          console.error("Could not copy text: ", err);
        });
    };

    return (
        <div>
            
            <ListItem style=
                {props.currentList == props.currentPhraseList.name ? { backgroundColor: '#03bafc' } : { backgroundColor: 'white' }}>
                <ListItemText primary={state.phraseList.name} />
                <IconButton onClick={handleClick}>
                    <EditIcon />
                </IconButton>
            </ListItem>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        position: 'unset',
                        ml: '25vw',
                        width: '50vw',
                        mt: '25vh',
                        height: '50vh',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    },
                }}
                transformOrigin={{ horizontal: 'center', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
            >
                <TextField
                    variant='standard'
                    onChange={handleChangePhraseName}
                    value = {state.phraseList.name}
                    sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', ml: '3vw', mr: '3vw', mt: '2vh', position: 'sticky', textAlign: 'center'}}
                >
                
                </TextField>
                <Paper
                    variant='outlined'
                    component="form"  
                    sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', ml: '3vw', mr: '3vw', mt: '2vh', position: 'sticky'}}
                > 
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Input Phrase"
                        value = {state.currentPhrase}
                        onKeyDown = {handleEnter}
                        onChange = {handleChange}
                    />
                    <IconButton onClick={handleAddButtonClick} className="swal2-confirm swal2-styled" style={{ marginRight: '10px' }}>
                        <span>Add</span>
                    </IconButton>
                    <IconButton onClick={handleCopyToClipboard} className="swal2-confirm swal2-styled">
                        <span>Copy to Clipboard</span>
                    </IconButton>
                </Paper>
                <div style={{ textAlign: 'center' }}>{additionMessage}</div>  {/* Render the additionMessage here */}
                <List
                    sx={{height: '30vh', mt: '1vh', bgcolor: 'background.paper',  overflow: 'overlay', overflowWrap: 'anywhere' }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    
                >
                    {/* {state.phraseList.phrases.map((phrase: string, index) =>
                        <div key={index}>
                            <ListItem >
                                <ListItemText primary={phrase} />
                                <IconButton onClick={handleClickX(index)} >
                                    <ClearIcon />
                                </IconButton>

                            </ListItem>
                        </div>
                    )} */}

                    {state.phraseList.phrases.filter((phrase) => 
                        phrase.toLowerCase().startsWith(state.currentPhrase.toLowerCase())
                        ).map((phrase: string, index) =>
                        <div key={index}>
                            <ListItem>
                            <ListItemText primary={phrase} />
                            <IconButton onClick={handleClickX(index)}>
                                <ClearIcon />
                            </IconButton>
                            </ListItem>
                        </div>
                    )}
                </List>
            </Menu>
        </div>
    );
}


