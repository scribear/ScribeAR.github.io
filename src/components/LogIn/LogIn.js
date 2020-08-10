import React, { Component } from 'react'
import AuthNavItem from './AuthNavItem';
import config from './Config';
import { UserAgentApplication } from 'msal';
import {getUserDetails, getFolders} from './graphService';
import Welcome from './Welcome';
import { Button } from 'reactstrap';


export default class LogIn extends Component {
    constructor(props) {
        super(props);


        this.userAgentApplication = new UserAgentApplication({
            auth: {
                clientId: config.appId,
                redirectUri: config.redirectUri,
            },
            cache: {
                cacheLocation: 'localStorage',
                storeAuthStateInCookie: true
            }
        });



        var user = this.userAgentApplication.getAccount();


        this.state = {
            isAuthenticated : (user !== null),
            user : {},
            error: null,
            items: []
        }
        this.normalizeError = this.normalizeError.bind(this)

        if (user) {
            this.getUserProfile();
        }
    }

    normalizeError(error) {
      var normalizedError = {};
      if (typeof(error) === 'string') {
        var errParts = error.split('|');
        normalizedError = errParts.length > 1 ?
          { message: errParts[1], debug: errParts[0] } :
          { message: error };
      } else {
        normalizedError = {
          message: error.message,
          debug: JSON.stringify(error)
        };
      }
      return normalizedError;
    }

    async login() {
        try {
          // Login via popup
          await this.userAgentApplication.loginPopup(
              {
                scopes: config.scopes,
                prompt: "select_account"
            });
          // After login, get the user's profile
          await this.getUserProfile();
        }
        catch(err) {
          this.setState({
            isAuthenticated: false,
            user: {},
            error: this.normalizeError(err)
          });
        }
      }


      logout() {
        this.userAgentApplication.logout();
      }


      async getUserProfile() {
        try {
          var accessToken = await this.userAgentApplication.acquireTokenSilent({
              scopes: config.scopes
          });
  
          if (accessToken) {
              var user = await getUserDetails(accessToken);
            // TEMPORARY: Display the token in the error flash
            this.setState({
              isAuthenticated: true,
              user: {
                  displayName: user.displayName,
                  email: user.email || user.userPrincipalName
              },
              error: null
            });
          }
        }
        catch(err) {
          this.setState({
            isAuthenticated: false,
            user: {},
            error: this.normalizeError(err)
          });
        }
      }


      async getFoldersCatch() {
        try {
          var accessToken = await window.msal.acquireTokenSilent({
              scopes: config.scopes
          });
  
          if (accessToken) {
              var folders = await getFolders(accessToken);
            // TEMPORARY: Display the token in the error flash
          }
        }
        catch(err) {
          console.log(err)
        }
      }
    render() {
        return (
            <AuthNavItem
                  isAuthenticated={this.state.isAuthenticated}
                  user = {this.state.user}
                  authButtonMethod = {this.state.isAuthenticated ? this.logout.bind(this) : this.login.bind(this)}
            />
        )
    }
}