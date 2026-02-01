import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";
import "../css/component/QrScanner.css";

function QrScanner({ onResult, onClose }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: 250,
      },
      false
    );

    scanner.render(
      (decodedText) => {
        scanner.clear();
        onResult(decodedText); // 👈 username comes here
      },
      (error) => {
        // ignore scan errors
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [onResult]);

  return (
    <div className="qr-overlay">
      <div className="qr-card">
        <h3>Scan QR</h3>
        <div id="qr-reader" />
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default QrScanner;
