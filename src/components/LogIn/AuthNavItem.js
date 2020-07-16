import * as React from 'react';
import '@fortawesome/fontawesome-free/css/all.css';
import {
    Collapse,
    Container,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem } from 'reactstrap';
import { Button } from "@material-ui/core"
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';




function UserAvatar(props) {
    // If a user avatar is available, return an img tag with the pic
    if (props.user.avatar) {
        return <img
                src={props.user.avatar} alt="user"
                className="rounded-circle align-self-center mr-2"
                style={{width: '32px'}}></img>;
    }
    
    // No avatar available, return a default icon
    return <i
            className="far fa-user-circle fa-lg rounded-circle align-self-center mr-2"
            style={{width: '32px'}}></i>;
    }



export function AuthNavItem(props) {
    if (props.isAuthenticated) {
        return (
            <Button aria-controls="simple-menu" 
        aria-haspopup="true" variant="contained" 
        variant="text" color="secondary" 
        onClick={props.authButtonMethod} 
        startIcon={<EmojiEmotionsIcon/>}>Log Out
        </Button>
        
        //   <UncontrolledDropdown>
        //     <DropdownToggle nav caret>
        //         {/* <UserAvatar user={props.user}/> */}
        //     </DropdownToggle>
        //     <DropdownMenu right>
        //       <h5 className="dropdown-item-text mb-0">{props.user.displayName}</h5>
        //       <p className="dropdown-item-text text-muted mb-0">{props.user.email}</p>
        //       <DropdownItem divider />
        //       <DropdownItem onClick={props.authButtonMethod}>Sign Out</DropdownItem>
        //     </DropdownMenu>
        //   </UncontrolledDropdown>
        );
      }
    
      // Not authenticated, return a sign in link
      return (
        // <NavItem>
      


        <Button aria-controls="simple-menu" 
        aria-haspopup="true" variant="contained" 
        variant="text" color="secondary" 
        onClick={props.authButtonMethod} 
        startIcon={<AccountCircleIcon/>}>Sign In
        </Button>

        // </NavItem>
      );
};

export default AuthNavItem;