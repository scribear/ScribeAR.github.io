import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {connect} from 'react-redux';
import store from '../../../../store/';
import { flip_entered_key, azure_key } from '../../../../redux/actions'
import './index.css'


class UserInput extends React.Component {


  constructor(props) {

    super(props);
    var temp_azure_key = localStorage.getItem('azure_subscription_key');
    if (store.azureKeyReducer == undefined) {
    this.state = {value: temp_azure_key};
    } else {
      if (store.azureKeyReducer != 'incorrect' && store.azureKeyReducer != 'empty') {
      var temp = store.azureKeyReducer;
      var astr_str ='';
      if (temp.length > 5) {
      temp = temp.substr(temp.length - 4);
      astr_str = new Array(store.azureKeyReducer.length - 4).join( '*' );
    }
      }
      this.state = {value: astr_str + temp};
    }
    if (this.state != undefined) {
      if (this.state.value != undefined && this.state.value != "") {
        store.azureKeyReducer = this.state.value;
      }
    }

    this.handleChange = this.handleChange.bind(this);

  }
  handleChange(event) {
    this.setState({value: event.target.value});
    store.azureKeyReducer = event.target.value;
    event.preventDefault();
    localStorage.setItem('azure_subscription_key', event.target.value);
  }



  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          <div className = "keytext">
            Enter Azure Key:
          </div>

          <div className = "keybox">
            <input id= "azure_key_value" type="text" placeholder= "Azure Subscription Key" value={this.state.value} onChange={this.handleChange} />
          </div>

        </label>

      </form>
    );
  }
}
export default UserInput;
