let currentCanvas = null;

function generateQR() {
  const url = document.getElementById("urlInput").value.trim();
  const signature = document.getElementById("signatureInput").value.trim();

  const qrContainer = document.getElementById("qrcode");
  const signatureText = document.getElementById("signatureText");

  if (!url) {
    alert("Masukkan URL terlebih dahulu.");
    return;
  }

  qrContainer.innerHTML = "";

  new QRCode(qrContainer, {
    text: url,
    width: 260,
    height: 260,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
  });

  signatureText.innerText = signature || "Tanda Tangan";

  setTimeout(() => {
    currentCanvas = qrContainer.querySelector("canvas");
  }, 300);
}

function downloadQR() {
  if (!currentCanvas) {
    alert("Generate QR terlebih dahulu.");
    return;
  }

  const link = document.createElement("a");
  link.download = "qr-signature.png";
  link.href = currentCanvas.toDataURL();
  link.click();
}
