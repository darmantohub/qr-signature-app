
let currentCanvas = null;

function generateQR() {
  const url = document.getElementById("urlInput").value.trim();
  const signature = document.getElementById("signatureInput").value.trim();
  const position = document.getElementById("positionInput").value.trim();
  const institution = document.getElementById("institutionInput").value.trim();
  const note = document.getElementById("noteInput").value.trim();

  const qrContainer = document.getElementById("qrcode");
  const signatureText = document.getElementById("signatureText");

  if (!url && !signature && !position && !institution && !note) {
    alert("Masukkan URL atau data tanda tangan terlebih dahulu.");
    return;
  }

  let qrData = "";

  if (url) {
    qrData = url;
  } else {
    qrData = [
      `Nama Penanda Tangan: ${signature || "-"}`,
      `Jabatan: ${position || "-"}`,
      `Instansi: ${institution || "-"}`,
      `Keterangan: ${note || "-"}`,
      `Dibuat: ${new Date().toLocaleString()}`,
    ].join("\n");
  }

  qrContainer.innerHTML = "";

  new QRCode(qrContainer, {
    text: qrData,
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

document.addEventListener("DOMContentLoaded", function () {
  const inputs = [
    document.getElementById("urlInput"),
    document.getElementById("signatureInput"),
    document.getElementById("positionInput"),
    document.getElementById("institutionInput"),
    document.getElementById("noteInput"),
  ];

  inputs.forEach((input) => {
    input.addEventListener("input", function () {
      const hasValue = inputs.some((item) => item.value.trim());

      if (hasValue) {
        generateQR();
      }
    });
  });
});
