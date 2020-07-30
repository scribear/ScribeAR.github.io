import React, {Component} from 'react';
import {connect} from "react-redux";


class StereoVisualiser extends Component {

    constructor(props) {
        super(props);
        this.canvas = React.createRef();

    }


    draw() {
        const canvas = this.canvas.current;
        const audioDataL = this.props.audioDataL;
        const audioDataR = this.props.audioDataR;
        const height = canvas.height;
        const width = canvas.width;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, width, height);
        if (this.props.mic == 4) { // circular Visualization
            this.drawCircular(audioDataL, context, height, width, 1, this.props.sens);
            this.drawCircular(audioDataR, context, height, width, -1, this.props.sens);
        } else if (this.props.mic == 5) {// Rectangular
            this.drawRectangle(audioDataL, audioDataR, context, height, width, this.props.sens);
        } else if (this.props.mic == 6) {// Double Spectrum
            this.drawDoubleSpectrum(audioDataL, audioDataR, context, height, width, this.props.sens);
        }


    }

    drawDoubleSpectrum(audioDataL, audioDataR, context, height, width, sens) {
        const RADIUS = 200;
        const POINTS = 360;

        for (let i = POINTS / 8; i < POINTS + POINTS / 8; i++) {
            //left spectrum
            let rel = ~~(i * (POINTS / audioDataL.length));
            let x = width / 8 + RADIUS * -Math.cos((i * 0.5 * Math.PI) / POINTS);
            let y = height / 2 + RADIUS * -Math.sin((i * 0.5 * Math.PI) / POINTS);
            // console.log("sens at this point is "+ sens);
            let x_2 = x + (audioDataL[rel] / (4/sens) ) * -Math.cos((i * 0.5 * Math.PI) / POINTS); // 4 any positive value
            let y_2 = y + (audioDataL[rel] / (4/sens) ) * -Math.sin((i * 0.5 * Math.PI) / POINTS); // 4 any positive value
            let x_5 = x - 0.3 * Math.cos((i * 0.5 * Math.PI) / POINTS);
            let y_5 = y - 0.3 * Math.sin((i * 0.5 * Math.PI) / POINTS);
            //draw the circular spectrum
            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(x_2, y_2);
            context.strokeStyle = this.props.iscolor ? '#000000' : '#F8F8FF';
            context.stroke();
            //draw the margin circle
            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(x_5, y_5);
            context.stroke();

            //right spectrum
            rel = ~~(i * (POINTS / audioDataR.length));
            x = 3 * width / 4 + RADIUS * Math.cos((i * 0.5 * Math.PI) / POINTS);
            y = height / 2 + RADIUS * -Math.sin((i * 0.5 * Math.PI) / POINTS);
            x_2 = x + (audioDataR[rel] / (4/sens) ) * Math.cos((i * 0.5 * Math.PI) / POINTS); // 4 any positive value
            y_2 = y + (audioDataR[rel] / (4/sens) ) * -Math.sin((i * 0.5 * Math.PI) / POINTS); // 4 any positive value
            x_5 = x - 0.3 * Math.cos((i * 0.5 * Math.PI) / POINTS);
            y_5 = y - 0.3 * Math.sin((i * 0.5 * Math.PI) / POINTS);
            //draw the circular spectrum
            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(x_2, y_2);
            context.strokeStyle = this.props.iscolor ? '#000000' : '#F8F8FF';
            context.stroke();
            //draw the margin circle
            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(x_5, y_5);
            context.stroke();
        }


    }


    drawRectangle(audioDataL, audioDataR, context, height, width, sens) {
        let sumL = audioDataL.reduce((previous, current) => current += previous);
        let avgL = sumL / audioDataL.length;
        let sumR = audioDataR.reduce((previous, current) => current += previous);
        let avgR = sumR / audioDataR.length;

        //background
        context.fillStyle = '#B6E1A5';
        context.fillRect(width / 2, height / 4, 80, 50)
        context.fillStyle = '#E1AAA5';
        context.fillRect(width / 2, height / 4, -80, 50)

        let RightVal = avgR * sens; // any positive value
        let LeftVal = avgL * sens; // any positive value
        //right
        context.fillStyle = '#5BDA2B';
        if (RightVal > 80) {
            context.fillRect(width / 2, height / 4, 80, 50)
        } else {
            context.fillRect(width / 2, height / 4, RightVal, 50)
        }

        //left
        context.fillStyle = '#ff0000';
        if (LeftVal > 80) {
            context.fillRect(width / 2, height / 4, -80, 50)
        } else {
            context.fillRect(width / 2, height / 4, -LeftVal, 50)
        }

        //indicator line
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(width / 2, height / 4);
        context.lineTo(width / 2, height / 4 + 50);
        context.strokeStyle = this.props.iscolor ? '#000000' : '#F8F8FF';
        context.stroke();
    }


    drawCircular(audioData, context, height, width, cir, sens) {
        const RADIUS = 80;
        const POINTS = 360;
        let sum = audioData.reduce((previous, current) => current += previous);
        let avg = sum / audioData.length;

        for (let i = POINTS / 2; i < POINTS + POINTS / 2; i++) {
            let rel = ~~(i * (POINTS / audioData.length));
            let x = width / 2 + cir * RADIUS * Math.cos((i * 1 * Math.PI) / POINTS);
            let y = height / 2 + RADIUS * Math.sin((i * 1 * Math.PI) / POINTS);
            let x_2 = x + cir * (audioData[rel] / (4 /sens )) * Math.cos((i * 1 * Math.PI) / POINTS); // 4 takes any positive value
            let y_2 = y + (audioData[rel] / (4 /sens )) * Math.sin((i * 1 * Math.PI) / POINTS); // 4 takes any positive value
            let x_3 = width / 2 + (sens) * avg * cir * Math.cos((i * 1 * Math.PI) / POINTS); // 1 takes any positive value
            let y_3 = height / 2 + (sens) * avg * -cir * Math.sin((i * 1 * Math.PI) / POINTS); // 1 takes any positive value
            let x_4 = x_3 - 0.5 * avg * cir * Math.cos((i * 1 * Math.PI) / POINTS);
            let y_4 = y_3 - 0.5 * avg * -cir * Math.sin((i * 1 * Math.PI) / POINTS);
            let x_5 = x - 0.3 * cir * Math.cos((i * 1 * Math.PI) / POINTS);
            let y_5 = y - 0.3 * -cir * Math.sin((i * 1 * Math.PI) / POINTS);
            //draw the circular spectrum
            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(x_2, y_2);
            if (cir == 1) {
                context.strokeStyle = '#E1AAA5';
            } else {
                context.strokeStyle = '#B6E1A5';
            }
            context.stroke();
            //draw the margin circle
            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(x_5, y_5);
            context.stroke();
            //draw the inner circle
            context.beginPath();
            context.moveTo(x_4, y_4);
            context.lineTo(x_3, y_3);
            if (y_4 - y_3 > 10) {
                if (cir == 1) {
                    context.strokeStyle = '#ff0000';
                } else {
                    context.strokeStyle = '#5BDA2B';
                }

            }
            context.stroke();
        }

    }

    componentDidUpdate() {
        this.draw();
    }

    render() {
        let width = "1700vw"
        if (this.props.mic == 4) {
            width = "400vw"
        } else if (this.props.mic == 5) {
            width = "400vw"
        } else if (this.props.mic == 6) {
            width = "1800vw"
        }

        return <canvas width={width} height="300vh" ref={this.canvas}/>;
    }

}

// const mapStateToProps = state => ({
//   sens: state.sens
// });
//
// export default connect (
//       mapStateToProps,
// )
// (StereoVisualiser);

export default  StereoVisualiser;

