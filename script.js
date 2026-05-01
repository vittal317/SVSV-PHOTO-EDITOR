// UI Navigation
const landingPage = document.getElementById('landing-page');
const editorWorkspace = document.getElementById('editor-workspace');
const startBtn = document.getElementById('start-editing-btn');

startBtn.addEventListener('click', () => {
    landingPage.style.display = 'none';
    editorWorkspace.style.display = 'flex';
});

// Editor Logic
const fileInput = document.getElementById('file-input');
const uploadBox = document.getElementById('upload-box');
const previewImg = document.getElementById('preview-img');
const filterBtns = document.querySelectorAll('.filter-btn');
const filterName = document.getElementById('filter-name');
const filterValue = document.getElementById('filter-value');
const filterSlider = document.getElementById('filter-slider');
const resetBtn = document.getElementById('reset-btn');
const saveBtn = document.getElementById('save-btn');

let brightness = "100", saturation = "100", inversion = "0", grayscale = "0";

// Handle Image Upload
uploadBox.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', () => {
    let file = fileInput.files[0];
    if(!file) return;
    previewImg.src = URL.createObjectURL(file);
    previewImg.onload = () => {
        uploadBox.style.display = 'none';
        previewImg.style.display = 'block';
        resetBtn.click();
    }
});

const applyFilters = () => {
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
}

// Handle Filter Buttons
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        btn.classList.add('active');
        filterName.innerText = btn.innerText;

        if(btn.id === "brightness") {
            filterSlider.max = "200";
            filterSlider.value = brightness;
        } else if(btn.id === "saturation") {
            filterSlider.max = "200";
            filterSlider.value = saturation;
        } else if(btn.id === "inversion") {
            filterSlider.max = "100";
            filterSlider.value = inversion;
        } else {
            filterSlider.max = "100";
            filterSlider.value = grayscale;
        }
        filterValue.innerText = `${filterSlider.value}%`;
    });
});

// Handle Slider
filterSlider.addEventListener('input', () => {
    filterValue.innerText = `${filterSlider.value}%`;
    const activeFilter = document.querySelector('.filter-btn.active').id;

    if(activeFilter === "brightness") brightness = filterSlider.value;
    else if(activeFilter === "saturation") saturation = filterSlider.value;
    else if(activeFilter === "inversion") inversion = filterSlider.value;
    else grayscale = filterSlider.value;

    applyFilters();
});

// Handle Reset
resetBtn.addEventListener('click', () => {
    brightness = "100"; saturation = "100"; inversion = "0"; grayscale = "0";
    filterBtns[0].click();
    applyFilters();
});

// Handle Export
saveBtn.addEventListener('click', () => {
    if(!previewImg.src || previewImg.src === window.location.href) {
        alert("Please upload an image first!");
        return; 
    }
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.drawImage(previewImg, 0, 0, canvas.width, canvas.height);
    const link = document.createElement("a");
    link.download = "SVSV-Pro-Edit.jpg";
    link.href = canvas.toDataURL();
    link.click();
});
