import React, { Component } from 'react';



class AudioVisualiser extends Component {

  constructor(props) {
    super(props);
    this.canvas = React.createRef();
  }
  draw() {
      const { audioData } = this.props;
      const canvas = this.canvas.current;
      const height = canvas.height;
      const width = canvas.width;
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, width, height);

      if (this.props.mic == 1){ // Line visualization
          this.drawLine(audioData,context,height,width);
      }
      else if (this.props.mic == 2){// Spectrum visualization
          this.drawSpectrum(audioData,context,height,width);
      }
      else if (this.props.mic == 3){// Circular visualization
          this.drawCircular(audioData,context,height,width);
      }


}

drawLine(audioData,context,height,width){
       let x = 0;
       const sliceWidth = (width * 1.0) / audioData.length;
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(0, height / 2);
      for (const item of audioData) {
          const y = (item / 255.0) * height;
          context.lineTo(x, y);
          x += sliceWidth;
      }
      context.lineTo(x, height / 2);
      context.strokeStyle = this.props.iscolor ? '#000000' : '#F8F8FF';
      context.stroke();
}

drawSpectrum(audioData,context,height,width){
      let x = 0;
      const barWidth = (width / audioData.length) * 2.5;
      let barHeight;
      for(const item of audioData) {
          barHeight = item/2;
          context.fillStyle = this.props.iscolor ? '#000000' : '#F8F8FF';
          context.fillRect(x,height/2-barHeight/2,barWidth,barHeight);
          x += barWidth + 1;
          }

}

drawCircular(audioData,context,height,width){
      const RADIUS = 80;
      const POINTS = 360;
      let sum = audioData.reduce((previous, current) => current += previous);
      let avg = sum / audioData.length;

      for(let i = 0; i < POINTS; i++) {
          let rel = ~~(i * (POINTS/audioData.length));
          let x = width/2 + RADIUS * Math.cos( (i * 2 * Math.PI) / POINTS );
          let y = height/2 + RADIUS * -Math.sin( (i * 2 * Math.PI) / POINTS );
          let x_2 = x + (audioData[rel]/4) * Math.cos( (i * 2 * Math.PI) / POINTS );
          let y_2 = y + (audioData[rel]/4) * -Math.sin( (i * 2 * Math.PI) / POINTS );
          let x_3 = width/2 + 1 *  avg * Math.cos((i * 2 * Math.PI) / POINTS );
          let y_3 = height/2 + 1 * avg * -Math.sin((i * 2 * Math.PI) / POINTS );
          let x_4 = x_3 - 0.5 *  avg * Math.cos((i * 2 * Math.PI) / POINTS );
          let y_4 = y_3 - 0.5 * avg * -Math.sin((i * 2 * Math.PI) / POINTS );
          let x_5 = x - 0.3  * Math.cos((i * 2 * Math.PI) / POINTS );
          let y_5 = y - 0.3  * -Math.sin((i * 2 * Math.PI) / POINTS);
          //draw the circular spectrum
          context.beginPath();
          context.moveTo(x, y);
          context.lineTo(x_2, y_2);
          context.strokeStyle = this.props.iscolor ? '#000000' : '#F8F8FF';
          context.stroke();
          //draw the margin circle
          context.beginPath();
          context.moveTo(x,y);
          context.lineTo(x_5,y_5);
          context.stroke();
          //draw the inner circlew
          context.beginPath();
          context.moveTo(x_4,y_4);
          context.lineTo(x_3,y_3);
          if(y_4 - y_3 > 10){
              context.strokeStyle = '#ff0000';
          }
          context.stroke();
          }

}
componentDidUpdate() {
    this.draw();
  }

  render() {
      let width = "1700vw"
      if (this.props.mic == 1){
          width = "1800vw"
      }else if (this.props.mic == 2){
          width = "1600vw"
      }else if (this.props.mic == 3){
          width = "400vw"

      }

    return <canvas width={width} height="300vh" ref={this.canvas} />;
  }

}

export default AudioVisualiser;
