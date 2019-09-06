import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

//export default function OnOff({ item, value, toggle }) {
class OnOff extends React.Component {
     constructor(props) {
          super(props);
     }

     setButton() {
          if (Object.values(this.props.keyVal)[0])
               return {
                    text: 'OFF',
                    color: '#800000'
               };
          return {
               text: 'ON',
               color: '#008000'
          };
     }

     render() {
          return (
               <div className="row">
                    <div className="col-8">
                         <p>{this.props.item}</p>
                    </div>
                    <div className="col-2 align-items-center">
                         <button
                           onClick={ () => {
                              this.props.toggle(this.props.keyVal);
                           }}
                           style={{backgroundColor: this.setButton().color}}>
                              {this.setButton().text}
                         </button>
                    </div>
               </div>
          );
     }
}

OnOff.propTypes = {
     item: PropTypes.string.isRequired,
     keyVal: PropTypes.objectOf(PropTypes.bool).isRequired,
     toggle: PropTypes.func.isRequired
}

export default OnOff;
