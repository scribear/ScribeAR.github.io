import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {useSelector,useDispatch} from 'react-redux';
import { submenu1,submenu2 } from '../../redux/actions';


 


export default function SimpleMenu(props) {
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
    <div>
      <IconButton  onClick={handleClick}>
        <MenuIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => dispatch(submenu1())}>WebSpeech</MenuItem>
        <MenuItem onClick={() => dispatch(submenu2())}>Azure</MenuItem>
        {/* <MenuItem>{setting}</MenuItem> */}
        <MenuItem onClick={handleClose}>return</MenuItem>
      </Menu>
    </div>
  );
}
