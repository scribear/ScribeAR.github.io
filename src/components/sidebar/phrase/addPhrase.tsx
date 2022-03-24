import * as React from 'react';
import List from '@mui/material/List';
import Button from "@mui/material/Button";
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useDispatch, useSelector } from 'react-redux';

export default function AzureDropdown(props) {
    console.log("AHOIFHOISAHOIFHSAOISHFOIAHSOFIH")
    const dispatch = useDispatch()

    const [state, setState] = React.useState({
        phrase: "" 
    });
    const handleChangeKey = (event) => {
        dispatch({type: 'FLIP_RECORDING_PHRASE', payload: false})

        setState({
            ...state, 
            phrase: event.target.value});
    } 

    const toggleEnter = async () => {
        dispatch({type: 'ADD_PHRASE', payload: state.phrase})
        setState({
            ...state, 
            phrase: ""});
        dispatch({type: 'FLIP_RECORDING_PHRASE', payload: true})




    }
    
    return (
        <div>
                <List component="div" disablePadding>
                    <ListItem sx={{ pl: 4 }}>
                        <Box
                            component="form"
                            sx={{
                                '& > :not(style)': { mr: '1vw', width: '15vw' },
                            }}
                            noValidate
                            autoComplete="off"
                        ><TextField onChange={handleChangeKey} value={state.phrase} label="Phrases" variant="outlined" /></Box>
                    </ListItem>
                    <Button sx={{ pl: 4 }}>
                        <ListItemText primary="Enter" onClick={toggleEnter}/>
                    </Button>
                </List>
        </div>
    );
}