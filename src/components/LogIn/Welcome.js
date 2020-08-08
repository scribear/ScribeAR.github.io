import React from 'react';
import {
  Button,
  Jumbotron } from 'reactstrap';



function WelcomeContent(props) {
  // If authenticated, greet the user
  if (props.isAuthenticated) {
    return (
      <div>
        <h4> Hello {props.user.email}!</h4>
      </div>
    );
  }

  // Not authenticated, present a sign in button
  return null;
}

export default class Welcome extends React.Component{
  render() {
    return (
      <Jumbotron>
        <WelcomeContent
          isAuthenticated={this.props.isAuthenticated}
          user={this.props.user}/>
      </Jumbotron>
    );
  }
}