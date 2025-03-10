
const getLocalIpAddress = async (): Promise<string> => {
    return new Promise((resolve) => {
      const peerConnection = new RTCPeerConnection({ iceServers: [] });
  
      peerConnection.createDataChannel(""); // Create a data channel
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          const ipMatch = event.candidate.candidate.match(
            /(\d+\.\d+\.\d+\.\d+)/ // Extract IPv4 addresses
          );
          if (ipMatch) {
            resolve(ipMatch[1]); // Return the first found local IP
            peerConnection.close();
          }
        }
      };
  
      peerConnection.createOffer()
        .then((offer) => peerConnection.setLocalDescription(offer))
        .catch(() => resolve("127.0.0.1")); // Fallback if WebRTC fails
    });
  };
  
  export default getLocalIpAddress;