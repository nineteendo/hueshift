function drawFrame() {
    const rightEye = document.getElementById('rightEye');
    const rightCanvas = document.querySelector('canvas');
    if (rightEye.paused || rightEye.ended) return;
    rightCanvas.width = rightEye.videoWidth;
    rightCanvas.height = rightEye.videoHeight;
    const ctx = rightCanvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(rightEye, 0, 0, rightCanvas.width, rightCanvas.height);
    const frame = ctx.getImageData(0, 0, rightCanvas.width, rightCanvas.height);
    const data = frame.data;
    for (let i = 0; i < data.length; i += 4) {
        [data[i], data[i + 1], data[i + 2]] = [data[i + 1], data[i + 2], data[i]];
    }
    ctx.putImageData(frame, 0, 0);
    requestAnimationFrame(drawFrame);
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } } });
        document.getElementById('leftEye').srcObject = stream;
        const rightEye = document.getElementById('rightEye');
        rightEye.srcObject = stream;
        const rightCanvas = document.createElement('canvas');
        rightEye.parentNode.insertBefore(rightCanvas, rightEye);
        rightEye.style.display = 'none';
        rightEye.addEventListener('play', drawFrame);
    } catch (error) {
        console.error('Error accessing webcam: ', error);
    }
});