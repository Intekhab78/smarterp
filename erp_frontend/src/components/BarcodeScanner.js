import React, { useRef, useEffect } from 'react';
import Webcam from "react-webcam";
import Quagga from 'quagga';

const BarcodeScanner = ({ onDetected, onClose }) => {
    const webcamRef = useRef(null);
    const playPromiseRef = useRef(null);

    useEffect(() => {
        // Initialize Quagga and start the webcam only if not already playing
        if (webcamRef.current && !playPromiseRef.current) {
            playPromiseRef.current = webcamRef.current.video.play();
            playPromiseRef.current.catch(error => {
                console.error("Play request was interrupted", error);
            });
        }

        Quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: webcamRef.current.video, // video element for barcode scanning
                constraints: {
                    facingMode: "environment" // use the back camera
                }
            },
            decoder: {
                readers: ["code_128_reader", "ean_reader", "ean_8_reader", "upc_reader", "upc_e_reader"]
            }
        }, (err) => {
            if (err) {
                console.error("Quagga initialization error:", err);
                return;
            }
            Quagga.start();
        });

        Quagga.onDetected((data) => {
            Quagga.stop();
            onDetected(data.codeResult.code);
        });

        return () => {
            Quagga.offDetected();
            Quagga.stop();
            if (webcamRef.current && playPromiseRef.current) {
                playPromiseRef.current = null; // clear play promise reference on unmount
            }
        };
    }, [onDetected]);

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
        }}>
            <div style={{ position: "relative", width: "80%", maxWidth: "600px" }}>
                <Webcam
                    ref={webcamRef}
                    style={{ width: "100%", height: "auto" }}
                    videoConstraints={{
                        facingMode: "environment"
                    }}
                />
                <button onClick={onClose} style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    padding: "10px 20px",
                    backgroundColor: "#ff4d4f",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                }}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default BarcodeScanner;
