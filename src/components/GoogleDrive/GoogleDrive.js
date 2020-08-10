import React from 'react'
import { Button } from "@material-ui/core"
import $ from 'jquery';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
// In this document, a 'line' is more like a sentence.
// this.state.line is like a buffer of text held at the end of the page. When the line
// is finished, the buffer is flushed: a new div is appended to the 'out' div and
// this.state.line is reset for the next line.

class GoogleDrive extends React.PureComponent {
     constructor() {
          super()

          this.state = {
            clientId : "571907483883-3qdl0lhi372dq7tc3v7d2v4eug7s200k.apps.googleusercontent.com",
            redirect_uri : "http://google.com",
            scope : "https://www.googleapis.com/auth/drive",
            url : ""
          }
          // this.appendLine = this.appendLine.bind(this)
          // this.start = this.start.bind(this)
          this.signIn = this.signIn.bind(this)
     }


    signIn(clientId,redirect_uri,scope,url) {

        // the actual url to which the user is redirected to

        this.setState({url : "https://accounts.google.com/o/oauth2/v2/auth?redirect_uri="+this.state.redirect_uri
        +"&prompt=consent&response_type=code&client_id="+this.state.clientId+"&scope="+this.state.scope
        +"&access_type=offline"});

        // this line makes the user redirected to the url

        window.open("https://accounts.google.com/ServiceLogin/signinchooser?service=wise&passive=true&continue=http%3A%2F%2Fdrive.google.com%2F%3Futm_source%3Den&utm_medium=button&utm_campaign=web&utm_content=gotodrive&usp=gtd&ltmpl=drive&flowName=GlifWebSignIn&flowEntry=ServiceLogin");
     }

     // componentDidMount() {
     //
     // }
     //
     // componentWillUnmount() {
     //
     // }

     render() {
          return (
             <Button onClick={this.signIn} startIcon={<CloudUploadIcon/>}>Upload</Button>
           )
     }
}

export default GoogleDrive
