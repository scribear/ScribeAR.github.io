import React, {Component } from 'react';
import StereoVisualiser from './StereoVisualiser'


/*global Unit8Array*/


class StereoAnalyser extends Component {

     constructor(props) {
          super(props);
          this.state = {
                audioDataL : new Uint8Array(0),
                audioDataR : new Uint8Array(0)
          };
          this.tick = this.tick.bind(this);
     }

     componentDidMount() {
     this.audioContext = new (window.AudioContext ||
       window.webkitAudioContext)();
          //load music
      this.audio =  document.querySelector('audio');


//const track = audioCtx.createMediaElementSource(audioElement);
     this.source = this.audioContext.createMediaElementSource(this.audio);

     this.splitter = this.audioContext.createChannelSplitter(2);
     this.analyserL = this.audioContext.createAnalyser();
     this.analyserR = this.audioContext.createAnalyser();

     this.source.connect(this.splitter);
     this.splitter.connect(this.analyserL, 0, 0);
     this.splitter.connect(this.analyserR, 1, 0);
     this.dataArrayL = new Uint8Array(this.analyserL.frequencyBinCount);
     this.dataArrayR = new Uint8Array(this.analyserR.frequencyBinCount);
     //this.source.connect(this.analyserL);
     //this.source.connect(this.analyserR);
     //     this.audio.autoplay = true;
         this.source.connect(this.audioContext.destination);
     this.rafId = requestAnimationFrame(this.tick);
   }

     tick() {
         if (this.props.mic == 1){
             //console.log("1");n
             this.analyserL.getByteFrequencyData(this.dataArrayL);
             this.analyserR.getByteFrequencyData(this.dataArrayR)
         }else if (this.props.mic == 2){
             this.analyserR.getByteFrequencyData(this.dataArrayR);
             this.analyserL.getByteFrequencyData(this.dataArrayL);
         }else if (this.props.mic == 3){
             this.analyserL.getByteFrequencyData(this.dataArrayL);
             this.analyserR.getByteFrequencyData(this.dataArrayR);
         }

     this.setState({ audioDataL: this.dataArrayL , audioDataR: this.dataArrayR});
     this.rafId = requestAnimationFrame(this.tick);
   }

   componentWillUnmount() {
    cancelAnimationFrame(this.rafId);
    this.analyserL.disconnect();
    this.analyserR.disconnect();
    this.source.disconnect();
  }

  render() {
         //console.log(this.state.audioData);
         //console.log(this.props.audio);
      return (
          <div>
               <audio src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/858/outfoxing.mp3"
                    crossOrigin="anonymous"  controls={true}>
               </audio>
              <StereoVisualiser audioDataL={this.state.audioDataL} audioDataR={this.state.audioDataR} iscolor = {this.props.iscolor} mic = {this.props.mic}/>
          </div>);
    }


}

export default StereoAnalyser;