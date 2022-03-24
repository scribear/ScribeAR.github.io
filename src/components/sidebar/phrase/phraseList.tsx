import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Menu from '@mui/material/Menu';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import './phrase.css'
import IconButton from "@mui/material/IconButton";
import ListItemText from '@mui/material/ListItemText';
import { PhraseList } from '../../../redux/types';
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
          setState({ ...state, currentPhrase: ""})  
        clickAddList(event)
       
        event.preventDefault();
      }
    }
    const clickAddList = (event) => {
        if (event.target.value) {
            state.phraseList.phrases.push(event.target.value)
            dispatch({ type: "EDIT_PHRASE_LIST", payload: state.phraseList })
            dispatch({ type: "CHANGE_LIST", payload: state.phraseList.phrases })
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
                </Paper>
                <List
                    sx={{height: '30vh', mt: '1vh', bgcolor: 'background.paper',  overflow: 'overlay', overflowWrap: 'anywhere' }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    
                >
                    {state.phraseList.phrases.map((phrase: string, index) =>
                        <div>
                            <ListItem >
                                <ListItemText primary={phrase} />
                                <IconButton onClick={handleClickX(index)} >
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


