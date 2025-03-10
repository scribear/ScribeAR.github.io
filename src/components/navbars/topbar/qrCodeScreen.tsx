import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import getLocalIpAddress from './api/getip';
import { Button, Typography, Drawer } from '@mui/material';

export default function QRCodeComponent() {
    const [localIp, setLocalIp] = useState<string>("Loading...");
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [qrOpen, setQrOpen] = useState(false);
    
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

    return (
        <>
            {!isStudentMode && (
                <Button variant="contained" color="primary" onClick={() => setQrOpen(true)}>
                    Show QR Code
                </Button>
            )}
            <Drawer 
                anchor="right" 
                open={qrOpen} 
                onClose={() => setQrOpen(false)}
                ModalProps={{ keepMounted: true }} // Prevents background from losing focus
                sx={{
                    width: '40%',
                    '& .MuiDrawer-paper': {
                        width: '40vw',
                        boxShadow: 'none', // Removes overlay effect
                        backgroundColor: 'white' // Ensures background remains solid
                    }
                }}
            >
                <div style={{ padding: 20, textAlign: "center" }}>
                    <Typography variant="h6" gutterBottom>
                        Instructions:
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        1. Make sure you are connected to <strong>illinois.net</strong> WiFi.
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        2. Scan the QR code below.
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        3. If the QR code is not working, type in:
                    </Typography>
                    <Typography variant="body1" style={{ fontWeight: "bold", wordBreak: "break-all" }}>
                        {`http://${localIp}:3000?mode=student&server=scribear-server&serverAddress=ws://${localIp}:8000/sink${accessToken ? `&accessToken=${accessToken}` : ''}`}
                    </Typography>
                    <div style={{ marginTop: 20 }}>
                        {accessToken ? (
                            <QRCode 
                                value={`http://${localIp}:3000?mode=student&server=scribear-server&serverAddress=ws://${localIp}:8000/sink&accessToken=${accessToken}`} 
                                size={200} 
                            />
                        ) : (
                            <QRCode 
                                value={`http://${localIp}:3000?mode=student&server=scribear-server&serverAddress=ws://${localIp}:8000/sink`} 
                                size={200} 
                            />
                        )}
                    </div>
                </div>
            </Drawer>
        </>
    );
}
