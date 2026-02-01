import { QRCodeCanvas } from "qrcode.react";
import { FaDownload, FaTimes } from "react-icons/fa";
import "../css/component/QrCode.css";

function UserQrCard({ username, onClose }) {
  const downloadQR = () => {
    const canvas = document.getElementById("user-qr");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");

    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${username}_qr.png`;
    downloadLink.click();
  };
  
  return (
    <div className="qr-overlay">
      <div className="qr-card">
        <FaTimes className="close-icon" onClick={onClose} />

        <h3>{username}</h3>

        <QRCodeCanvas
          id="user-qr"
          value={username}   // 👈 THIS is what scanner reads
          size={180}
          level="H"
        />

        <button onClick={downloadQR}>
          <FaDownload /> Download QR
        </button>
      </div>
    </div>
  );
}

export default UserQrCard;
