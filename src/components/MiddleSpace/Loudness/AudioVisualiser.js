import React, { Component } from 'react';
import { useSelector } from 'react-redux'


class AudioVisualiser extends Component {
  
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
  }
  draw() {
   //const bgC = useSelector((state) => state.invertColors)
   const { audioData } = this.props;
   const canvas = this.canvas.current;
   const height = canvas.height;
   const width = canvas.width;
   const context = canvas.getContext('2d');
   let x = 0;
   const sliceWidth = (width * 1.0) / audioData.length;
   context.lineWidth = 2;
   //context.strokeStyle = bgC ? '#000000' : '#F8F8FF';
   context.clearRect(0, 0, width, height);
   context.beginPath();
   context.moveTo(0, height / 2);
   for (const item of audioData) {
      const y = (item / 255.0) * height;
      context.lineTo(x, y);
      x += sliceWidth;
    }
   context.lineTo(x, height / 2);
   context.stroke();
}

componentDidUpdate() {
    this.draw();
  }

  render() {
    return <canvas width="500vw" height="300vh" ref={this.canvas} />;
  }

}

export default AudioVisualiser;
