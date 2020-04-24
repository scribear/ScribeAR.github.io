
import React, { Component } from 'react';
import AudioAnalyser from './AudioAnalyser';

class Index extends Component {
  constructor(props) {
   super(props);
   this.state = {
     audio: null
   };
  this.toggleMicrophone = this.toggleMicrophone.bind(this);

 }

 async getMicrophone() {
    const audio = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false
    });
    this.setState({ audio });
  }

  stopMicrophone() {
     this.state.audio.getTracks().forEach(track => track.stop());
     this.setState({ audio: null });
   }

   toggleMicrophone() {
    if (this.state.audio) {
      this.stopMicrophone();
    } else {
      this.getMicrophone();
    }
  }

  render() {
     return (

         <div className="controls" style = {{height:"100%",width:"100%"}}>
           <button onClick={this.toggleMicrophone} style = {{
             position:"fixed",
             top:"35vh",
             left:"65vw",
             width:"10vw",
             height:"10vh",
             fontSize: "1.5vw",
             textAlign: "left"
           }}>
             {this.state.audio ? 'Stop MIC' : 'Get MIC input'}
           </button>
           {this.state.audio ? <AudioAnalyser audio={this.state.audio} /> : ''}

         </div>

     );
   }
}

export default Index;
