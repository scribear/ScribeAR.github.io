import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { ControlStatus } from '../../../react-redux&middleware/redux/typesImports';
import { useAccessToken } from '../useAccessToken';

const QRCode = require('qrcode');

export function QRCodeVisual(props: { visualWidth: string; visualHeight: string }) {
  const controlStatus = useSelector((state: RootState) => {
    return state.ControlReducer as ControlStatus;
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const urlParams = new URLSearchParams(window.location.search);
  const isKioskMode = urlParams.get('mode') === 'kiosk';
  const serverAddress = urlParams.get('serverAddress');
  const scribearURL = `${window.location.protocol}//${window.location.host}`;

  const {
    accessToken,
    nodeServerAddress,
    successful,
    loading,
  } = useAccessToken(serverAddress, isKioskMode);

  const qrValue = `${scribearURL}?mode=student&serverAddress=${nodeServerAddress}${accessToken ? `&accessToken=${accessToken}` : ''}`;

  const drawQRCode = () => {
    if (!controlStatus.showQRCode || loading || !successful || !nodeServerAddress) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    QRCode.toCanvas(canvas, qrValue, {
      width: parseFloat(props.visualWidth) * 0.4,  // Make canvas smaller inside box
      margin: 2,
      color: {
        dark: "#FFFF00",
        light: "#000000"
      }
    }, function (error: any) {
      if (error) console.error(error);
    });
  };

  useEffect(() => {
    drawQRCode();
  }, [
    controlStatus.showQRCode,
    loading,
    successful,
    nodeServerAddress,
    accessToken,
    props.visualWidth,
    props.visualHeight
  ]);

  if (!controlStatus.showQRCode || !isKioskMode) {
    return null;
  }

  const containerWidth = parseFloat(props.visualWidth);
  const containerHeight = parseFloat(props.visualHeight);

  return (
    <div
      style={{
        width: containerWidth,
        height: containerHeight,
        backgroundColor: 'black',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        overflow: 'hidden',
        padding: '10px',
        boxSizing: 'border-box'
      }}
    >
      {/* Left Side: Text */}
      <div style={{
        flex: 1,
        minWidth: 0,
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        fontSize: `calc(${props.visualHeight} * 0.065)`,  // Font size dynamically based on height
        overflow: 'hidden',
        overflowWrap: 'break-word',
        wordBreak: 'break-word',
        flexShrink: 1     
      }}>
        <h4 style={{ margin: 0 }}>Instructions:</h4>
        <p style={{ margin: '5px 0' }}>1. Connect to <strong>illinois.net</strong> WiFi.</p>
        <p style={{ margin: '5px 0' }}>2. Scan the QR code below.</p>
        <p style={{ margin: '5px 0' }}>3. If QR code doesn't work, type:</p>
        <p style={{ margin: '5px 0', color: 'yellow' }}>{qrValue}</p>
      </div>

      {/* Right Side: QR Code */}
      <div style={{
        flex: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <canvas
          ref={canvasRef}
          width={containerWidth * 0.4}
          height={containerWidth * 0.4}
          style={{
            backgroundColor: 'black'
          }}
        />
      </div>
    </div>
  );
}