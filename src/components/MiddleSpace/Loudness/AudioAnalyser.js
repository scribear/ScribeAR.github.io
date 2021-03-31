import React, { Component } from 'react';
import AudioVisualiser from './AudioVisualiser'
import { connect } from "react-redux";




class AudioAnalyser extends Component {

  constructor(props) {
    super(props);
    this.state = {
      audioData: new Uint8Array(0)
    };
    this.tick = this.tick.bind(this);
  }

  componentDidMount() {

    this.audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.source = this.audioContext.createMediaStreamSource(this.props.audio);
    this.source.connect(this.analyser);
    this.rafId = requestAnimationFrame(this.tick);
  }

  tick() {
    if (this.props.mic == 1) {
      this.analyser.getByteTimeDomainData(this.dataArray);
    } else if (this.props.mic == 2) {
      this.analyser.getByteFrequencyData(this.dataArray);
    } else if (this.props.mic == 3) {
      this.analyser.getByteFrequencyData(this.dataArray);
    }
    this.setState({ audioData: this.dataArray });
    this.rafId = requestAnimationFrame(this.tick);
  }

  componentWillUnmount() {

    cancelAnimationFrame(this.rafId);
    this.analyser.disconnect();
    this.source.disconnect();
  }

  render() {
    return <AudioVisualiser audioData={this.state.audioData} iscolor={this.props.iscolor} mic={this.props.mic} sens={this.props.sens} />;
  }


}
const mapStateToProps = state => ({
  sens: state.sens
});


export default connect(
  mapStateToProps,

)(AudioAnalyser);
// export default AudioAnalyser;
