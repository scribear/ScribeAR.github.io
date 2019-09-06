import React from 'react';
import './App.css';
import TextArea from './components/TextArea';
import TopSpace from './components/TopSpace';

var DEFAULT_TEXT_SIZE = 48;
var DEFAULT_LINE_WIDTH = 10;
var DEFAULT_NUM_LINES = 4;

class App extends React.Component {
     state = {
          textSize: DEFAULT_TEXT_SIZE,
          lineWidth: DEFAULT_LINE_WIDTH,
          numLines: DEFAULT_NUM_LINES,
          lockScreen: true,
          invertColors: false
     }

     changeSetting(obj) {
          this.setState(obj);
     }

     render() {
          return (
               <div className="App">
                    <div className="grid-container">
                         <TopSpace toggle={this.changeSetting.bind(this)}
                              opts={this.state} />
                         <TextArea />
                    </div>
               </div>
          );
     }
}

export default App;
