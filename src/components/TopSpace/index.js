import React from 'react';
import PropTypes from 'prop-types';
import './index.css';
import Options from './Options';

class TopSpace extends React.Component {
     constructor(props) {
          super(props)
          this.state = {
               display: null
          }
          this.hide = this.hide.bind(this)
          this.show = this.show.bind(this)
     }
     hide() {
          this.setState({ display: 'none' });
          document.getElementById('outer').addEventListener('click', this.show)
     }
     show() {
          this.setState({ display: null })
          document.getElementById('outer').removeEventListener('click', this.show)
     }

     render() {
          var h = this.props.height
          return (
               <div className="TopSpace" id="outer" style={{ height: h }}>
                    <div className="Container" id="inner" style={this.state}>
                         <div className="TheBox1">
                              <Options />
                         </div>
                         <div className="TheBox2" onClick={this.hide}>
                              <div className="GavinBelsonSignatureBox">Hide</div>
                         </div>
                    </div>
               </div>
          )
     }
}

export default TopSpace;
