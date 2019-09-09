import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment } from './redux/actions';
import TextArea from './components/TextArea';
import TopSpace from './components/TopSpace';
import './App.css';

/* var DEFAULT_TEXT_SIZE = 48;
var DEFAULT_LINE_WIDTH = 10;
var DEFAULT_NUM_LINES = 4;
360 x 640 screen */

class App extends React.Component {
     render() {
          return (
               <div className="App">
                    <div className="row-8">
                         <TopSpace />
                    </div>
                    <div className="row-4">
                         <TextArea />
                    </div>
               </div>
          );
     }
}

export default App;
