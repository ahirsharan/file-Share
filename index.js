const dropZone = document.querySelector(".drop-zone");
const browseBtn = document.querySelector(".browseBtn");
const fileInput = document.querySelector("#fileInput");
const fileURL = document.querySelector("#fileURL");
const sharingContainer = document.querySelector(".sharing-container");
const copyBtn = document.querySelector("#copyBtn");
const bgProgress = document.querySelector(".bg-progress");
const progressBar = document.querySelector(".progress-bar");
const percentDiv = document.querySelector(".percent-container");
const progressContainer = document.querySelector(".progress-container");
const toast = document.querySelector(".toast");

const host = "https://fileshare-sharan.herokuapp.com/";

const uploadURL = `${host}api/files`;
const maxAllowedSize = 10 * 1024 * 1024;


dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    if (!dropZone.classList.contains("dragged")) {
        dropZone.classList.add("dragged");
    }
});

dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragged");
});

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragged");
    const files = e.dataTransfer.files;

    console.table(files);
    if (files.length) {
        fileInput.files = files;
        uploadFile();
    }
});

fileInput.addEventListener("change", () => {
    uploadFile();
});

browseBtn.addEventListener("click", () => {
    fileInput.click();
});

copyBtn.addEventListener("click", () => {
    fileURL.select();
    document.execCommand("copy");
    showToast("Link Copied!");
});

const uploadFile = () => {
    progressContainer.style.display = "block";

    if (fileInput.files.length > 1) {
        resetFileInput();
        showToast("Only upload 1 file!");
        return;
    }

    const file = fileInput.files[0];

    if (file.size > maxAllowedSize) {
        showToast("Max limit of 10MB exceeded!");
        resetFileInput();
        return;
    }

    const formData = new FormData;
    formData.append("myfile", file);

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            console.log(xhr.response);
            progressContainer.style.display = "none";
            showLink(JSON.parse(xhr.response));
        }
    };

    xhr.upload.onprogress = updateProgress;
    xhr.upload.onerror = () => {
        resetFileInput();
        showToast(`Error in upload: ${xhr.statusText}`);
    }

    xhr.open("POST", uploadURL);
    xhr.send(formData);
};


const showLink = ({ file: url }) => {
    fileURL.value = url;
    sharingContainer.style.display = "block";
};


const updateProgress = (e) => {
    const percent = Math.round((e.loaded / e.total) * 100);
    console.log(percent);

    bgProgress.style.width = `${percent}%`;
    percentDiv.innerText = `${percent}%`;
    progressBar.style.transform = `scaleX(${percent/100})`;
};

const resetFileInput = () => {
    fileInput.value = "";
};


let toastTimer;
const showToast = (msg) => {
    toast.innerText = msg;
    toast.style.transform = "translate(-50%,0)";

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.style.transform = "translate(-50%,60px)";
    }, 2000);
};