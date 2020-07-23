import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {useSelector,useDispatch} from 'react-redux';


 


export default function PopAPI(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const textContent = props.text;
  const titleContent = props.title;

  const submenu = (state) => state.submenu;
  const dispatch = useDispatch();
  const setting = useSelector(submenu);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style = {{display:"inline"}}>
      <Button  onClick={handleClick} size = "small">
          {props.title}
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem >Azure</MenuItem>
        <MenuItem >WebSpeech</MenuItem>
        {/* <MenuItem onClick={() => dispatch(submenu3())}>Audio Visualization</MenuItem> */}
      </Menu>
    </div>
  );
}
