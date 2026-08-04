import { useRef } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import jsQR from "jsqr"

function QRScannerModal({ onClose, onScan }) {

    const fileInputRef = useRef(null);

    const handleImageUpload = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = (event) => {

            const image = new Image();

            image.src = event.target.result;

            image.onload = () => {

                const canvas = document.createElement("canvas");

                const ctx = canvas.getContext("2d");

                canvas.width = image.width;
                canvas.height = image.height;

                ctx.drawImage(image, 0, 0);

                const imageData = ctx.getImageData(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );

                const code = jsQR(
                    imageData.data,
                    canvas.width,
                    canvas.height
                );

                if (code) {

                    onScan(code.data);

                } else {

                    alert("❌ No QR Code found in this image.");

                }

            };

        };

        reader.readAsDataURL(file);

    };

    return (

        <div className="scanner-overlay">

            <div className="scanner-modal">

                <h2>QR Attendance Scanner</h2>

                <BarcodeScannerComponent
                    width={350}
                    height={350}
                    onUpdate={(err, result) => {

                        if (result) {

                            onScan(result.text);

                        }

                    }}
                />

                <div className="scanner-buttons">

                    <button
                        onClick={() => fileInputRef.current.click()}
                    >
                        🖼 Scan Image
                    </button>

                    <button
                        className="scanner-close"
                        onClick={onClose}
                    >
                        ❌ Close
                    </button>

                </div>

                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                />

            </div>

        </div>

    );

}

export default QRScannerModal;