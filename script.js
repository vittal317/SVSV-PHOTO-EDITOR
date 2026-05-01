// State Management
let originalImage = null;
let currentImage = null;
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let currentTool = null;
let history = [];
let historyStep = -1;
let cropMode = false;
let cropStart = { x: 0, y: 0 };

// Initialize
document.getElementById('imageInput').addEventListener('change', handleImageUpload);
document.getElementById('slider').addEventListener('input', applyEffect);

function uploadImage() {
    document.getElementById('imageInput').click();
}

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            // Set canvas size
            const maxWidth = canvas.parentElement.offsetWidth - 20;
            const maxHeight = canvas.parentElement.offsetHeight - 20;
            let width = img.width;
            let height = img.height;

            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width *= ratio;
                height *= ratio;
            }

            canvas.width = width;
            canvas.height = height;

            // Draw and store
            ctx.drawImage(img, 0, 0, width, height);
            originalImage = canvas.toDataURL();
            currentImage = canvas.toDataURL();
            history = [currentImage];
            historyStep = 0;

            // Hide placeholder
            document.getElementById('placeholder').style.display = 'none';
            canvas.style.display = 'block';
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

function setTool(tool) {
    currentTool = tool;
    
    // Update active button
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.tool-btn').classList.add('active');

    // Show/hide slider for tools that need it
    const sliderTools = ['brightness', 'contrast', 'saturation', 'hue', 'opacity', 'blur', 'sharpen', 'pixelate'];
    if (sliderTools.includes(tool)) {
        document.getElementById('sliderGroup').style.display = 'flex';
        document.getElementById('slider').value = 100;
        updateSliderLabel(tool);
    } else {
        document.getElementById('sliderGroup').style.display = 'none';
    }

    // Apply instant effects
    if (['grayscale', 'sepia', 'invert', 'emboss', 'edge-detect', 'rotate', 'flip-h', 'flip-v', 'crop', 'vintage', 'warm', 'cool'].includes(tool)) {
        applyEffect();
    }
}

function updateSliderLabel(tool) {
    const labels = {
        brightness: 'Brightness:',
        contrast: 'Contrast:',
        saturation: 'Saturation:',
        hue: 'Hue:',
        opacity: 'Opacity:',
        blur: 'Blur (px):',
        sharpen: 'Sharpen:',
        pixelate: 'Pixelate:'
    };
    document.getElementById('sliderLabel').textContent = labels[tool] || 'Value:';
}

function applyEffect() {
    if (!originalImage) return;

    const img = new Image();
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const sliderValue = parseInt(document.getElementById('slider').value);
        document.getElementById('sliderValue').textContent = sliderValue;

        switch (currentTool) {
            case 'brightness':
                adjustBrightness(sliderValue);
                break;
            case 'contrast':
                adjustContrast(sliderValue);
                break;
            case 'saturation':
                adjustSaturation(sliderValue);
                break;
            case 'hue':
                adjustHue(sliderValue);
                break;
            case 'opacity':
                adjustOpacity(sliderValue);
                break;
            case 'blur':
                applyBlur(sliderValue);
                break;
            case 'grayscale':
                applyGrayscale();
                break;
            case 'sepia':
                applySepia();
                break;
            case 'invert':
                applyInvert();
                break;
            case 'sharpen':
                applySharpen(sliderValue);
                break;
            case 'emboss':
                applyEmboss();
                break;
            case 'edge-detect':
                applyEdgeDetect();
                break;
            case 'pixelate':
                applyPixelate(sliderValue);
                break;
            case 'rotate':
                applyRotate();
                break;
            case 'flip-h':
                applyFlipH();
                break;
            case 'flip-v':
                applyFlipV();
                break;
            case 'crop':
                applyCrop();
                break;
            case 'vintage':
                applyVintage();
                break;
            case 'warm':
                applyWarm();
                break;
            case 'cool':
                applyCool();
                break;
        }

        currentImage = canvas.toDataURL();
        if (historyStep < history.length - 1) {
            history = history.slice(0, historyStep + 1);
        }
        history.push(currentImage);
        historyStep++;
    };
    img.src = currentImage;
}

// Image adjustment functions
function adjustBrightness(value) {
    const brightness = value / 100;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i] *= brightness;
        data[i + 1] *= brightness;
        data[i + 2] *= brightness;
    }
    ctx.putImageData(imageData, 0, 0);
}

function adjustContrast(value) {
    const contrast = value / 100;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

    for (let i = 0; i < data.length; i += 4) {
        data[i] = factor * (data[i] - 128) + 128;
        data[i + 1] = factor * (data[i + 1] - 128) + 128;
        data[i + 2] = factor * (data[i + 2] - 128) + 128;
    }
    ctx.putImageData(imageData, 0, 0);
}

function adjustSaturation(value) {
    const saturation = value / 100;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg + (data[i] - avg) * saturation;
        data[i + 1] = avg + (data[i + 1] - avg) * saturation;
        data[i + 2] = avg + (data[i + 2] - avg) * saturation;
    }
    ctx.putImageData(imageData, 0, 0);
}

function adjustHue(value) {
    const hueShift = (value - 100) * 3.6;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0;

        if (max === min) h = 0;
        else if (max === r) h = (60 * (g - b) / (max - min) + 360) % 360;
        else if (max === g) h = (60 * (b - r) / (max - min) + 120) % 360;
        else if (max === b) h = (60 * (r - g) / (max - min) + 240) % 360;

        h = (h + hueShift) % 360;
        const s = max === 0 ? 0 : (max - min) / max;
        const v = max / 255;

        const c = v * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = v - c;

        let r2, g2, b2;
        if (h >= 0 && h < 60) [r2, g2, b2] = [c, x, 0];
        else if (h >= 60 && h < 120) [r2, g2, b2] = [x, c, 0];
        else if (h >= 120 && h < 180) [r2, g2, b2] = [0, c, x];
        else if (h >= 180 && h < 240) [r2, g2, b2] = [0, x, c];
        else if (h >= 240 && h < 300) [r2, g2, b2] = [x, 0, c];
        else [r2, g2, b2] = [c, 0, x];

        data[i] = (r2 + m) * 255;
        data[i + 1] = (g2 + m) * 255;
        data[i + 2] = (b2 + m) * 255;
    }
    ctx.putImageData(imageData, 0, 0);
}

function adjustOpacity(value) {
    ctx.globalAlpha = value / 100;
}

function applyBlur(value) {
    const blurAmount = value / 10;
    if (blurAmount > 0) {
        ctx.filter = `blur(${blurAmount}px)`;
        const img = new Image();
        img.src = currentImage;
        img.onload = () => {
            ctx.drawImage(img, 0, 0);
            ctx.filter = 'none';
        };
    }
}

function applyGrayscale() {
    ctx.filter = 'grayscale(100%)';
    const img = new Image();
    img.src = currentImage;
    img.onload = () => {
        ctx.drawImage(img, 0, 0);
        ctx.filter = 'none';
    };
}

function applySepia() {
    ctx.filter = 'sepia(100%)';
    const img = new Image();
    img.src = currentImage;
    img.onload = () => {
        ctx.drawImage(img, 0, 0);
        ctx.filter = 'none';
    };
}

function applyInvert() {
    ctx.filter = 'invert(100%)';
    const img = new Image();
    img.src = currentImage;
    img.onload = () => {
        ctx.drawImage(img, 0, 0);
        ctx.filter = 'none';
    };
}

function applySharpen(value) {
    const strength = value / 100;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const w = imageData.width;
    const h = imageData.height;

    const kernel = [
        0, -1, 0,
        -1, 5, -1,
        0, -1, 0
    ];

    const output = new Uint8ClampedArray(data.length);
    
    for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
            for (let c = 0; c < 3; c++) {
                let sum = 0;
                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const pixelIndex = ((y + ky) * w + (x + kx)) * 4 + c;
                        sum += data[pixelIndex] * kernel[(ky + 1) * 3 + (kx + 1)];
                    }
                }
                const index = (y * w + x) * 4 + c;
                output[index] = Math.min(255, sum * strength);
                output[index + 3] = data[index + 3];
            }
        }
    }

    for (let i = 0; i < data.length; i++) {
        data[i] = output[i] || data[i];
    }
    ctx.putImageData(imageData, 0, 0);
}

function applyEmboss() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const w = imageData.width;
    const h = imageData.height;

    const kernel = [
        -2, -1, 0,
        -1, 1, 1,
        0, 1, 2
    ];

    const output = new Uint8ClampedArray(data.length);
    
    for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
            for (let c = 0; c < 3; c++) {
                let sum = 0;
                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const pixelIndex = ((y + ky) * w + (x + kx)) * 4 + c;
                        sum += data[pixelIndex] * kernel[(ky + 1) * 3 + (kx + 1)];
                    }
                }
                const index = (y * w + x) * 4 + c;
                output[index] = Math.min(255, Math.max(0, sum + 128));
            }
            const index = (y * w + x) * 4 + 3;
            output[index] = data[index];
        }
    }

    for (let i = 0; i < data.length; i++) {
        data[i] = output[i] || data[i];
    }
    ctx.putImageData(imageData, 0, 0);
}

function applyEdgeDetect() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const w = imageData.width;
    const h = imageData.height;

    const kernel = [
        0, -1, 0,
        -1, 4, -1,
        0, -1, 0
    ];

    const output = new Uint8ClampedArray(data.length);
    
    for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
            for (let c = 0; c < 3; c++) {
                let sum = 0;
                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const pixelIndex = ((y + ky) * w + (x + kx)) * 4 + c;
                        sum += data[pixelIndex] * kernel[(ky + 1) * 3 + (kx + 1)];
                    }
                }
                const index = (y * w + x) * 4 + c;
                output[index] = Math.min(255, Math.max(0, sum));
            }
            const index = (y * w + x) * 4 + 3;
            output[index] = data[index];
        }
    }

    for (let i = 0; i < data.length; i++) {
        data[i] = output[i] || data[i];
    }
    ctx.putImageData(imageData, 0, 0);
}

function applyPixelate(value) {
    const pixelSize = Math.max(1, value / 10);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const w = imageData.width;

    for (let y = 0; y < canvas.height; y += pixelSize) {
        for (let x = 0; x < canvas.width; x += pixelSize) {
            const index = (y * w + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];

            for (let py = 0; py < pixelSize && y + py < canvas.height; py++) {
                for (let px = 0; px < pixelSize && x + px < canvas.width; px++) {
                    const pIndex = ((y + py) * w + (x + px)) * 4;
                    data[pIndex] = r;
                    data[pIndex + 1] = g;
                    data[pIndex + 2] = b;
                }
            }
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

function applyRotate() {
    const img = new Image();
    img.src = currentImage;
    img.onload = () => {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.height;
        tempCanvas.height = canvas.width;
        const tempCtx = tempCanvas.getContext('2d');

        tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
        tempCtx.rotate(Math.PI / 2);
        tempCtx.drawImage(img, -img.width / 2, -img.height / 2);

        canvas.width = tempCanvas.width;
        canvas.height = tempCanvas.height;
        ctx.drawImage(tempCanvas, 0, 0);
    };
}

function applyFlipH() {
    const img = new Image();
    img.src = currentImage;
    img.onload = () => {
        ctx.scale(-1, 1);
        ctx.drawImage(img, -canvas.width, 0);
        ctx.scale(-1, 1);
    };
}

function applyFlipV() {
    const img = new Image();
    img.src = currentImage;
    img.onload = () => {
        ctx.scale(1, -1);
        ctx.drawImage(img, 0, -canvas.height);
        ctx.scale(1, 1);
    };
}

function applyCrop() {
    // Simple crop - reduce image to 80% of current size from center
    const w = canvas.width * 0.8;
    const h = canvas.height * 0.8;
    const x = (canvas.width - w) / 2;
    const y = (canvas.height - h) / 2;

    const imageData = ctx.getImageData(x, y, w, h);
    canvas.width = w;
    canvas.height = h;
    ctx.putImageData(imageData, 0, 0);
}

function applyVintage() {
    const img = new Image();
    img.src = currentImage;
    img.onload = () => {
        ctx.drawImage(img, 0, 0);
        ctx.filter = 'sepia(60%) saturate(1.5) brightness(0.9)';
        ctx.drawImage(img, 0, 0);
        ctx.filter = 'none';
    };
}

function applyWarm() {
    const img = new Image();
    img.src = currentImage;
    img.onload = () => {
        ctx.drawImage(img, 0, 0);
        ctx.filter = 'saturate(1.2) brightness(1.1) sepia(20%)';
        ctx.drawImage(img, 0, 0);
        ctx.filter = 'none';
    };
}

function applyCool() {
    const img = new Image();
    img.src = currentImage;
    img.onload = () => {
        ctx.drawImage(img, 0, 0);
        ctx.filter = 'saturate(0.8) brightness(0.95) hue-rotate(200deg)';
        ctx.drawImage(img, 0, 0);
        ctx.filter = 'none';
    };
}

// Utility functions
function downloadImage() {
    if (!currentImage) {
        alert('Please upload an image first');
        return;
    }
    const link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = 'edited-image.png';
    link.click();
}

function resetImage() {
    if (originalImage) {
        const img = new Image();
        img.src = originalImage;
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            currentImage = canvas.toDataURL();
            history = [currentImage];
            historyStep = 0;
            document.getElementById('sliderGroup').style.display = 'none';
            document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
        };
    }
}

function undoEdit() {
    if (historyStep > 0) {
        historyStep--;
        const img = new Image();
        img.src = history[historyStep];
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            currentImage = history[historyStep];
        };
    }
}

function redoEdit() {
    if (historyStep < history.length - 1) {
        historyStep++;
        const img = new Image();
        img.src = history[historyStep];
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            currentImage = history[historyStep];
        };
    }
}
