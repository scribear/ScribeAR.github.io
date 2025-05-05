// useAccessToken.tsx
import { useEffect, useState } from "react";

interface AccessTokenData {
    accessToken: string;
    serverAddress: string;
    expires: string;
}

export function useAccessToken(serverAddress: string | null, isKioskMode: boolean) {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [nodeServerAddress, setNodeServerAddress] = useState<string>('');
    const [successful, setSuccessful] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isKioskMode || !serverAddress) return;

        let updateAccessTokenTimeout: NodeJS.Timeout;
        
        function updateAccessToken() {
            fetch(`http://${serverAddress}/accessToken`)
                .then(response => response.json())
                .then((data: AccessTokenData) => {
                    setNodeServerAddress(data.serverAddress);
                    setAccessToken(data.accessToken);
                    setSuccessful(true);

                    const expires = new Date(data.expires);
                    const millisecondsToExpiry = expires.getTime() - new Date().getTime();

                    updateAccessTokenTimeout = setTimeout(() => {
                        updateAccessToken();
                    }, millisecondsToExpiry - 10_000); // Refresh 10 seconds before expiry
                })
                .catch((error) => {
                    console.error("Failed to fetch access token:", error);
                    setSuccessful(false);
                })
                .finally(() => {
                    setLoading(false);
                });
        }

        updateAccessToken();

        return () => {
            clearTimeout(updateAccessTokenTimeout);
        };
    }, [serverAddress, isKioskMode]);

    return {
        accessToken,
        nodeServerAddress,
        successful,
        loading,
    };
}