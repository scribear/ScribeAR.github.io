import React, { useState } from 'react';
import { DisplayStatus } from '../../../react-redux&middleware/redux/typesImports';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import './resizable.css'

var startingX: number;
var startingY: number;

export function Resizable(props) {
  const theme = useSelector((state: RootState) => {
    return state.DisplayReducer as DisplayStatus;
  });

  const initialWidth = typeof props.size === 'object' ? `${props.size.width}px` : props.size;
  const initialHeight = typeof props.size === 'object' ? `${props.size.height}px` : props.size;

  const [style, setStyle] = useState({
    width: initialWidth,
    height: initialHeight,
    border: '',
  });

  const [borderStyle, setBorderStyle] = useState({
    border: ''
  });

  const mouseDownHandler = function (event) {
    event.preventDefault();
    startingX = event.clientX;
    startingY = event.clientY;

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  const mouseMoveHandler = function (event) {
    event.preventDefault();
    const dx: number = event.clientX - startingX;
    const dy: number = event.clientY - startingY;

    const original_width: number = parseFloat(style.width);
    const original_height: number = parseFloat(style.height);

    const newWidth: number = Math.max(original_width + dx, 100);
    const newHeight: number = Math.max(original_height + dy, 100);

    setStyle({
      ...style,
      width: `${newWidth}px`,
      height: `${newHeight}px`
    });

    return false;
  };

  const mouseUpHandler = function () {
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  };

  const mouseEnter = (event) => {
    setBorderStyle({ ...borderStyle, border: `3px dotted ${theme.textColor}` });
    setStyle({ ...style, border: `3px dotted ${theme.textColor}` });
  };

  const mouseLeave = (event) => {
    setBorderStyle({ ...borderStyle, border: '' });
    setStyle({ ...style, border: '' });
  };

  const renderChildren = (additionalProps: Object | null = null) => {
    if (!additionalProps) {
      return props.children;
    }

    return React.Children.map(props.children, (child) => {
      return React.cloneElement(child, additionalProps, null);
    });
  };

  return (
    <div className='resizable' onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} style={style}>
      <div className='resizer top-left' onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} onMouseDown={mouseDownHandler} style={borderStyle}></div>
      <div className='resizer top-right' onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} onMouseDown={mouseDownHandler} style={borderStyle}></div>
      {renderChildren({
        visualWidth: style.width,
        visualHeight: style.height
      })}
      <div className='resizer bottom-left' onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} onMouseDown={mouseDownHandler} style={borderStyle}></div>
      <div className='resizer bottom-right' onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} onMouseDown={mouseDownHandler} style={borderStyle}></div>
    </div>
  );
}