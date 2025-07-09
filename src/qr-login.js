import QrScanner from 'qr-scanner';

const video = document.getElementById('qr-video');
const resultDiv = document.getElementById('qr-result');

const qrScanner = new QrScanner(
  video,
  result => {
    // For demo: treat QR code as userId
    localStorage.setItem('userId', result);
    resultDiv.textContent = `Logged in as: ${result}`;
    setTimeout(() => {
      window.location.href = './index.html';
    }, 1000);
    qrScanner.stop();
  },
  {
    highlightScanRegion: true,
    highlightCodeOutline: true
  }
);

qrScanner.start();
