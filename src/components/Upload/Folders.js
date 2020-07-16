import React, { Component } from 'react'
import config from '../LogIn/Config';
import { UserAgentApplication } from 'msal';
import {getFolders} from '../LogIn/graphService';
import { Button } from 'reactstrap';


export default class Folders extends Component {
    constructor(props) {
        super(props);

        this.state = {
          folders : [],
          items: []
        }

        // this.getFoldersCatch = this.getFoldersCatch.bind(this)
    }

    async componentDidMount() {
      try {
        var accessToken = await window.msal.acquireTokenSilent({
            scopes: config.scopes
        });

        if (accessToken) {
            this.setState({folders : await getFolders(accessToken)});
            this.setState({folders : this.state.folders.value});
            console.log(this.state.folders)
        }
      }
      catch(err) {
        console.log(err)
      }
    }


    
    render() {
      const returnedArray = Array.from(this.state.folders)
        return (
          <div>
            {
              returnedArray.map((item) => {
                if (item.folder)
                return <h1>{item.name}</h1>
              }
              )
            }
            </div>
        )
    }
}