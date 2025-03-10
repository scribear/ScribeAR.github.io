import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import getLocalIpAddress from './api/getip' ;
import {  Button, Dialog } from '@mui/material';

export default function QRCodeComponent(){
    const [localIp, setLocalIp] = useState<string>("Loading...");
    const [accessToken, setAccessToken] = useState<string | null>(null);
       
    useEffect(() => {
      getLocalIpAddress().then((ip) => {
        setLocalIp(ip);
        console.log(ip);
        fetch(`http://localhost:8000/accessToken`)
          .then(response => response.json())
          .then(data => setAccessToken(data.accessToken))
          .catch(error => console.error("Failed to fetch access token:", error));
      });
    }, []);
    
  
    const urlParams = new URLSearchParams(window.location.search);
    const isStudentMode = urlParams.get('mode') === 'student';
    const [qrOpen, setQrOpen] = useState(false);
    
  
    return (
        <>
          {!isStudentMode && (
            <Button variant="contained" color="primary" onClick={() => setQrOpen(true)}>
              Show QR Code
            </Button>
          )}
          <Dialog open={qrOpen} onClose={() => setQrOpen(false)}>
            <div style={{ padding: 20, textAlign: "center" }}>
              {/* {accessToken ? (
              <QRCode value={`http://${localIp}:3000?mode=student&server=scribear-server&accessToken=${accessToken}`} size={200} />
                ) : (
                  <p>Loading QR Code...</p>
                )} */}
              {accessToken ? (
              <QRCode value={`http://${localIp}:3000?mode=student&server=scribear-server&serverAddress=ws://${localIp}:8000/sink&accessToken=${accessToken}`} size={200} />
                ) : (
                  <QRCode value={`http://${localIp}:3000?mode=student&server=scribear-server&serverAddress=ws://${localIp}:8000/sink`} size={200} />
                )}
            </div>
          </Dialog>
        </>
      );
  };
  