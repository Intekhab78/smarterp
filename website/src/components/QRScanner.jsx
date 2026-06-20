import { useEffect, useRef } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

export default function QRScanner({ onScan }) {
    const scannerRef = useRef(null);
    const isRunningRef = useRef(false);

    useEffect(() => {
        if (scannerRef.current) return; // prevent double init in StrictMode

        const scanner = new Html5Qrcode("qr-reader");
        scannerRef.current = scanner;

        const startScanner = async () => {
            try {
                await scanner.start(
                    { facingMode: "environment" },
                    {
                        fps: 20,

                        videoConstraints: {
                            facingMode: "environment",
                            focusMode: "continuous",
                        },

                        formatsToSupport: [
                            Html5QrcodeSupportedFormats.UPC_A,
                            Html5QrcodeSupportedFormats.UPC_E,
                            Html5QrcodeSupportedFormats.EAN_13,
                            Html5QrcodeSupportedFormats.EAN_8,
                            Html5QrcodeSupportedFormats.CODE_128,
                        ],

                        qrbox: (viewfinderWidth, viewfinderHeight) => ({
                            width: viewfinderWidth - 20,
                            height: viewfinderHeight - 20,
                        }),
                    },
                    (decodedText) => {
                        console.log("Decoded:", decodedText);
                        onScan(decodedText);
                    }
                );

                isRunningRef.current = true;
            } catch (err) {
                console.error("Camera permission error:", err);
            }
        };

        startScanner();

        return () => {
            if (scannerRef.current && isRunningRef.current) {
                scannerRef.current.stop().catch(() => { });
            }
        };
    }, [onScan]);
    return (
        <div className="relative w-full h-full">
            <div id="qr-reader" className="w-full h-full" />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/10 pointer-events-none" />
        </div>
    );

}
