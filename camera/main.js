function drawFrame() {
    const leftEye = document.getElementById('leftEye');
    const rightEye = document.getElementById('rightEye');
    if (leftEye.paused || leftEye.ended) return;
    rightEye.width = leftEye.videoWidth;
    rightEye.height = leftEye.videoHeight;
    const ctx = rightEye.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(leftEye, 0, 0, rightEye.width, rightEye.height);
    const frame = ctx.getImageData(0, 0, rightEye.width, rightEye.height);
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
        const leftEye = document.getElementById('leftEye');
        leftEye.srcObject = stream;
        leftEye.addEventListener('play', drawFrame);
    } catch (error) {
        console.error('Error accessing webcam: ', error);
    }
});