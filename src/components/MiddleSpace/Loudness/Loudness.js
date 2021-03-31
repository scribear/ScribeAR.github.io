import React from 'react';
import AudioAnalyser from './AudioAnalyser';


class Index extends React.PureComponent {
  constructor() {
    super()
    this.state = {
      audio: null
    };
    this.stopMicrophone = this.stopMicrophone.bind(this);
    this.getMicrophone = this.getMicrophone.bind(this);
  }

  componentDidMount() {
    this.getMicrophone()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.ismic === this.props.ismic)
      return
    if (this.props.ismic > 0 && this.props.ismic < 4) {
      this.getMicrophone()
    } else this.stopMicrophone()
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

      <div className="controls">
        {this.state.audio ?
          <AudioAnalyser audio={this.state.audio} iscolor={this.props.iscolor} mic={this.props.ismic} /> : ''}
      </div>

    );
  }
}

export default Index;


