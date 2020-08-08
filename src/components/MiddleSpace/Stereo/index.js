import React from 'react';
import StereoAnalyser from './StereoAnalyser';


class Stereo extends React.PureComponent {
    constructor() {
        super()
        this.state = {
            audio: null
        };

        //this.toggleMicrophone = this.toggleMicrophone.bind(this);
        this.stopMicrophone = this.stopMicrophone.bind(this);
        this.getMicrophone = this.getMicrophone.bind(this);
    }

    componentDidMount() {
        this.getMicrophone()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.ismic === this.props.ismic)
            return
        if (this.props.ismic > 3) {
            this.getMicrophone()
        } else this.stopMicrophone()
    }

    async getMicrophone() {
        const audio = document.querySelector('audio');
        this.setState({audio});

        // const audio = await navigator.mediaDevices.getUserMedia({
        //   audio: { mandatory: { echoCancellation: false}},
        //   video: false
        // });
        // this.setState({ audio });
    }

    stopMicrophone() {
        this.state.audio.getTracks().forEach(track => track.stop());
               this.audio.autoplay = true;
        this.setState({audio: null});
    }


    render() {
        return (

            <div className="controls">
                <audio src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/858/outfoxing.mp3"
                       crossOrigin="anonymous" controls={true}>
                </audio>
                {this.state.audio ?
                    <StereoAnalyser audio={this.state.audio} iscolor={this.props.iscolor} mic={this.props.ismic}/> : ''}
                {/*  {<StereoAnalyser  iscolor = {this.props.iscolor}  mic = {this.props.ismic}/>}*/}
            </div>

        );
    }
}

export default Stereo;