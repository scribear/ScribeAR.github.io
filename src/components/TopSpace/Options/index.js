import React from 'react';
import PropTypes from 'prop-types';
import OnOff from './OnOff';
import PlusMinus from './PlusMinus';
import './index.css';

class Options extends React.Component {
     updateCss = () => {
          if (this.props.hidden)
               return 'none';
          return 'block';
     }

     logsomething = () => {
          console.log("hello world");
     }

     render() {
          return (
               <div className="Options" id="options-space" style={{display: this.updateCss()}}>
                    <h1>Options</h1>
                    <div className="item-wrapper">
                         <PlusMinus
                              item="Text size"
                              value="48"
                              decrement={this.logsomething}
                              increment={this.logsomething}
                         />
                    </div>
                    <div className="item-wrapper">
                         <PlusMinus
                              item="Line width"
                              value="48"
                              decrement={this.logsomething}
                              increment={this.logsomething}
                         />
                    </div>
                    <div className="item-wrapper">
                         <PlusMinus
                              item="Number of lines"
                              value="48"
                              decrement={this.logsomething}
                              increment={this.logsomething}
                         />
                    </div>
                    <div className="item-wrapper">
                         <OnOff item="Lock screen"
                              keyVal={{ lockScreen: true }}
                              toggle={this.props.toggle} />
                    </div>
                    <div className="item-wrapper">
                         <OnOff item="Invert colors"
                              keyVal={{ invertColors: this.props.opts.invertColors}}
                              toggle={this.props.toggle} />
                    </div>
               </div>
          );
     }
}

Options.propTypes = {
     hidden: PropTypes.bool
}

export default Options;
