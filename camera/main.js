function rgb2hsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max == min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h, s, l];
}

function hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
}

function hsl2rgb(h, s, l) {
    let r, g, b;
    if (s == 0) {
        r = g = b = l;
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return [r * 255, g * 255, b * 255];
}

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
        let [h, s, l] = rgb2hsl(data[i], data[i + 1], data[i + 2]);
        h = (h + 1 / 3) % 1;
        [data[i], data[i + 1], data[i + 2]] = hsl2rgb(h, s, l);
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