import { QRCodeCanvas } from "qrcode.react";
// import useHideTawk from "../hooks/useHideTawk";
import POSPageFooter from "../components/POSPageFooter";

export default function GenerateQR() {
    // useHideTawk();
    const url = "https://shop.jtserp.info/scan";

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100 z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm w-full">
                <h2 className="text-xl font-bold mb-2">Scan to Shop</h2>

                <p className="text-gray-500 mb-4">
                    Open camera and scan to start shopping
                </p>

                <div className="flex justify-center">
                    <QRCodeCanvas value={url} size={220} />
                </div>

                <p className="text-sm mt-3 text-gray-400 break-all">
                    {/* {url} */}
                </p>
            </div>
            <POSPageFooter />

        </div>
    );
}
