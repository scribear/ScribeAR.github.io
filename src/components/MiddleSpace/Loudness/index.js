import React from 'react';
import AudioAnalyser from './AudioAnalyser';


class Index extends React.PureComponent {
  constructor() {
   super()
   this.state = {
     audio: null
   };

  //this.toggleMicrophone = this.toggleMicrophone.bind(this);
  this.stopMicrophone = this.stopMicrophone.bind(this);
  this.getMicrophone = this.getMicrophone.bind(this);
 }



 componentDidUpdate(prevProps,prevState) {
   if(prevProps.ismic === this.props.ismic)
      return
   if(this.props.ismic > 0){
      this.getMicrophone()
    }
   else this.stopMicrophone()
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


  render() {
     return (

         <div className="controls" >
           {this.state.audio ? <AudioAnalyser audio={this.state.audio}  iscolor = {this.props.iscolor}  mic = {this.props.ismic}/> : ''}
         </div>

     );
   }
}

export default Index;

// <button onClick={this.toggleMicrophone} style = {{
//   position:"fixed",
//   top:"35vh",
//   left:"65vw",
//   width:"10vw",
//   height:"10vh",
//   fontSize: "1.5vw",
//   textAlign: "left"
// }}>
//   {this.state.audio ? 'Stop MIC' : 'Get MIC input'}
// </button>
