import React, { useState } from "react";
import QRCode from "react-qr-code";
import { Button, Typography, Drawer } from '@mui/material';
import { useAccessToken } from "../../api/useAccessToken";

export default function QRCodeComponent() {
    const [qrOpen, setQrOpen] = useState(false);

    const urlParams = new URLSearchParams(window.location.search);
    const isKioskMode = urlParams.get('mode') === 'kiosk';
    const serverAddress = urlParams.get('serverAddress');
    const isStudentMode = urlParams.get('mode') === 'student';

    const scribearURL = `${window.location.protocol}//${window.location.host}`;

    const {
        accessToken,
        nodeServerAddress,
        successful,
        loading,
    } = useAccessToken(serverAddress, isKioskMode);

    if (!isKioskMode) return <></>;

    let QRCodeDisplay = <Typography variant="body1" style={{ fontWeight: "bold", wordBreak: "break-all" }}>Loading QR code...</Typography>
    if (!loading) {
        if (successful) {
            const qrValue = `${scribearURL}?mode=student&serverAddress=${nodeServerAddress}${accessToken ? `&accessToken=${accessToken}` : ''}`;

            QRCodeDisplay = (
                <>
                    <Typography variant="body1" style={{ fontWeight: "bold", wordBreak: "break-all" }}>
                        {qrValue}
                    </Typography>
                    <div style={{ marginTop: 20 }}>
                        <QRCode
                            value={qrValue}
                            size={200}
                        />
                    </div>
                </>
            );
        } else {
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
                ModalProps={{ keepMounted: true }}
                sx={{
                    width: '40%',
                    '& .MuiDrawer-paper': {
                        width: '40vw',
                        boxShadow: 'none',
                        backgroundColor: 'white'
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
                    {QRCodeDisplay}
                </div>
            </Drawer>
        </>
    );
}