import React, {Component} from 'react';
import StereoVisualiser from './StereoVisualiser'
import {connect} from "react-redux";


class StereoAnalyser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            audioDataL: new Uint8Array(0),
            audioDataR: new Uint8Array(0)
        };
        this.tick = this.tick.bind(this);
    }

    componentDidMount() {

        this.audioContext = new (window.AudioContext ||
            window.webkitAudioContext)();


        // this.source = this.audioContext.createMediaStreamSource(this.props.audio);
        this.source = this.audioContext.createMediaElementSource(this.props.audio);

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

        //     this.source.connect(this.audioContext.destination);
        this.rafId = requestAnimationFrame(this.tick);
    }

    tick() {
        if (this.props.mic == 4 || this.props.mic == 5 || this.props.mic == 6) {
            this.analyserL.getByteFrequencyData(this.dataArrayL);
            this.analyserR.getByteFrequencyData(this.dataArrayR);
        }


        this.setState({audioDataL: this.dataArrayL, audioDataR: this.dataArrayR});
        this.rafId = requestAnimationFrame(this.tick);
    }

    componentWillUnmount() {

        cancelAnimationFrame(this.rafId);
        this.analyserL.disconnect();
        this.analyserR.disconnect();
        this.source.disconnect();
    }

    render() {

        return (
            <div>

                <StereoVisualiser audioDataL={this.state.audioDataL} audioDataR={this.state.audioDataR}
                                  iscolor={this.props.iscolor} mic={this.props.mic} sens={this.props.sens}/>
            </div>);
    }


}
const mapStateToProps = state => ({
  sens: state.sens
});


export default connect(
  mapStateToProps,

)(StereoAnalyser);
// export default StereoAnalyser;