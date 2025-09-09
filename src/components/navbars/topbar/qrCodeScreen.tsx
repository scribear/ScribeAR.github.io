import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { Button, Typography, Drawer } from '@mui/material';

export default function QRCodeComponent() {
    const [successful, setSuccessful] = useState(false);
    const [loading, setLoading] = useState(true);
    const [scribearURL, setScribearURL] = useState('');
    const [nodeServerAddress, setNodeServerAddress] = useState('');
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [qrOpen, setQrOpen] = useState(false);

    const urlParams = new URLSearchParams(window.location.search);
    const isKioskMode = urlParams.get('mode') === 'kiosk';
    const kioskServerAddress = urlParams.get('kioskServerAddress');
    const isStudentMode = urlParams.get('mode') === 'student';
    const scribearURLParam = urlParams.get('scribearURL');
    const sourceToken = urlParams.get('sourceToken');

    useEffect(() => {
        if (!isKioskMode) return;

        setLoading(true);
        if (scribearURLParam) {
            setScribearURL(scribearURLParam);
        } else {
            setScribearURL(window.location.protocol + "//" + window.location.host + window.location.pathname);
        }

        let updateAccessTokenTimeout;
        function updateAccessToken() {
            fetch(`${kioskServerAddress}/api/accessToken`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ sourceToken })
            })
                .then(response => response.json())
                .then(data => {
                    if (!data.accessToken) {
                        throw Error('Unsuccessful request:' + JSON.stringify(data));
                    }

                    setNodeServerAddress(data.serverAddress);
                    setAccessToken(data.accessToken);
                    setSuccessful(true);

                    // When current token will expire
                    const expires = new Date(data.expires);
                    const millisecondToExpiry = expires.getTime() - new Date().getTime();

                    updateAccessTokenTimeout = setTimeout(() => {
                        updateAccessToken()
                    }, millisecondToExpiry - 10_000); // Refresh 10 seconds earlier than expiry
                })
                .catch(error => {
                    setSuccessful(false);
                    console.error("Failed to fetch access token:", error)

                    updateAccessTokenTimeout = setTimeout(() => {
                        updateAccessToken()
                    }, 30_000);
                })
                .finally(() => setLoading(false));
        }
        updateAccessToken();


        return () => {
            clearTimeout(updateAccessTokenTimeout)
        }
    }, [isKioskMode, scribearURLParam, kioskServerAddress, sourceToken]);

    if (!isKioskMode) return <></>;

    let QRCodeDisplay = <Typography variant="body1" style={{ fontWeight: "bold", wordBreak: "break-all" }}>Loading QR code...</Typography>
    if (!loading) {
        if (successful) {
            QRCodeDisplay = <>
                <Typography variant="body1" style={{ fontWeight: "bold", wordBreak: "break-all" }}>
                    {`${scribearURL}?mode=student&serverAddress=${nodeServerAddress}${accessToken ? `&accessToken=${accessToken}` : ''}`}
                </Typography>
                <div style={{ marginTop: 20 }}>
                    {accessToken ? (
                        <QRCode
                            value={`${scribearURL}?mode=student&serverAddress=${nodeServerAddress}&accessToken=${accessToken}`}
                            size={200}
                        />
                    ) : (
                        <QRCode
                            value={`${scribearURL}?mode=student&serverAddress=${nodeServerAddress}`}
                            size={200}
                        />
                    )}
                </div>
            </>
        }
        else {
            QRCodeDisplay = <Typography variant="body1" style={{ fontWeight: "bold", wordBreak: "break-all" }}>Failed to load QR code. Try refreshing the page.</Typography>
        }
    }

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
                        1. Make sure you are connected to the <strong>IllinoisNet</strong> WiFi network.
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        2. Scan the QR code below.
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        3. If the QR code is not working, type in:
                    </Typography>
                    {QRCodeDisplay}
                </div>
            </Drawer>
        </>
    );
}
