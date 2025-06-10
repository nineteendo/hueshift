document.addEventListener('DOMContentLoaded', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        document.getElementById('leftEye').srcObject = stream;
        document.getElementById('rightEye').srcObject = stream;
    } catch (error) {
        console.error('Error accessing webcam: ', error);
    }
});