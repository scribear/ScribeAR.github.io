import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { Button, Typography, Drawer } from '@mui/material';

export default function QRCodeComponent() {
    const [scribearURL, setScribearURL] = useState<string>('Loading...');
    const [nodeServerAddress, setNodeServerAddress] = useState<string>("Loading...");
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [qrOpen, setQrOpen] = useState(false);

    useEffect(() => {
        setScribearURL(window.location.protocol + "//" + window.location.host);

        fetch(`http://localhost:8080/accessToken`)
            .then(response => response.json())
            .then(data => {
                setNodeServerAddress(data.serverAddress);
                setAccessToken(data.accessToken);
            })
            .catch(error => console.error("Failed to fetch access token:", error));
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
                        {`${scribearURL}?mode=student&server=scribear-server&serverAddress=ws://${nodeServerAddress}/sink${accessToken ? `&accessToken=${accessToken}` : ''}`}
                    </Typography>
                    <div style={{ marginTop: 20 }}>
                        {accessToken ? (
                            <QRCode 
                                value={`${scribearURL}?mode=student&server=scribear-server&serverAddress=ws://${nodeServerAddress}/sink&accessToken=${accessToken}`} 
                                size={200} 
                            />
                        ) : (
                            <QRCode 
                                value={`${scribearURL}?mode=student&server=scribear-server&serverAddress=ws://${nodeServerAddress}/sink`} 
                                size={200} 
                            />
                        )}
                    </div>
                </div>
            </Drawer>
        </>
    );
}
