import React from 'react';
import './index.css';
import Options from './Options';

class TopSpace extends React.Component {
     constructor(props) {
          super(props);
          this.state = {
               optsHidden: false
          };
          this.updateCss = this.updateCss.bind(this);
          this.toggle = this.toggle.bind(this);
     }
     updateCss() {
          if (this.state.optsHidden)
               return 'none';
          return 'block';
     }
     hide() {
          this.setState({
               optsHidden: true
          });
     }
     toggle() {
          if (this.state.optsHidden)
               this.setState({
                    optsHidden: false
               });
     }
     render() {
          return (
               <div className="container-fluid" onClick={this.toggle}>
                    <div className="row">
                         <div className="col-1"></div>
                         <div className="col-5" id="options-region">
                              <Options hidden={this.state.optsHidden}
                                   toggle={this.props.toggle}
                                   opts={this.props.opts} />
                         </div>
                         <div className="col-6" id="hide-region"
                           style={{display: this.updateCss()}}
                           onClick={this.hide.bind(this)}>
                              <p>Hide</p>
                         </div>
                    </div>
               </div>
          );
     }
}

export default TopSpace;
