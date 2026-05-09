let currentCanvas = null;
let historyItems = JSON.parse(localStorage.getItem("qrHistory") || "[]");

function showPage(pageId) {
  document.querySelectorAll(".page-section").forEach((section) => {
    section.style.display = "none";
  });

  document.getElementById(pageId).style.display = "block";

  document.querySelectorAll(".sidebar a").forEach((link) => {
    link.classList.remove("active");
  });

  const activeLink = document.querySelector(`[data-page="${pageId}"]`);
  if (activeLink) activeLink.classList.add("active");

  if (pageId === "historyPage") renderHistory();
  if (pageId === "dashboardPage") renderDashboard();
}

function generateQR(saveToHistory = true) {
  const url = document.getElementById("urlInput").value.trim();
  const signature = document.getElementById("signatureInput").value.trim();
  const position = document.getElementById("positionInput").value.trim();
  const institution = document.getElementById("institutionInput").value.trim();
  const note = document.getElementById("noteInput").value.trim();

  const qrContainer = document.getElementById("qrcode");
  const signatureText = document.getElementById("signatureText");

  if (!url && !signature && !position && !institution && !note) {
    return;
  }

  const qrData = url || [
    `Nama Penanda Tangan: ${signature || "-"}`,
    `Jabatan: ${position || "-"}`,
    `Instansi: ${institution || "-"}`,
    `Keterangan: ${note || "-"}`,
    `Dibuat: ${new Date().toLocaleString()}`,
  ].join("\n");

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

  if (saveToHistory) {
    const item = {
      type: url ? "URL" : "Tanda Tangan",
      title: url || signature || "QR Code",
      qrData: qrData,
      signature: signature || "Tanda Tangan",
      createdAt: new Date().toLocaleString(),
    };

    historyItems.unshift(item);
    historyItems = historyItems.slice(0, 10);
    localStorage.setItem("qrHistory", JSON.stringify(historyItems));
    renderDashboard();
  }

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

function renderHistory() {
  const box = document.getElementById("historyList");

  if (!historyItems.length) {
    box.innerHTML = "<p>Belum ada riwayat QR Code.</p>";
    return;
  }

  box.innerHTML = historyItems.map((item, index) => `
    <div class="history-item">
      <div>
        <strong>${item.title}</strong>
        <span>${item.type} • ${item.createdAt}</span>
      </div>
      <div class="history-actions">
        <button class="view-button" onclick="viewHistory(${index})">View</button>
        <button class="danger-button" onclick="deleteHistory(${index})">Hapus</button>
      </div>
    </div>
  `).join("");
}


function viewHistory(index) {
  const item = historyItems[index];
  if (!item) return;

  showPage("qrPage");

  const qrContainer = document.getElementById("qrcode");
  const signatureText = document.getElementById("signatureText");

  qrContainer.innerHTML = "";

  new QRCode(qrContainer, {
    text: item.qrData || item.title,
    width: 260,
    height: 260,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
  });

  signatureText.innerText = item.signature || item.title || "Tanda Tangan";

  setTimeout(() => {
    currentCanvas = qrContainer.querySelector("canvas");
  }, 300);
}

function deleteHistory(index) {
  if (!confirm("Hapus riwayat QR ini?")) return;

  historyItems.splice(index, 1);
  localStorage.setItem("qrHistory", JSON.stringify(historyItems));
  renderHistory();
  renderDashboard();
}

function renderDashboard() {
  document.getElementById("totalQr").innerText = historyItems.length;
}

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".sidebar a").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      showPage(this.dataset.page);
    });
  });

  const inputs = ["urlInput", "signatureInput", "positionInput", "institutionInput", "noteInput"]
    .map((id) => document.getElementById(id));

  inputs.forEach((input) => {
    input.addEventListener("input", function () {
      if (inputs.some((item) => item.value.trim())) {
        generateQR(false);
      }
    });
  });

  showPage("dashboardPage");
});
