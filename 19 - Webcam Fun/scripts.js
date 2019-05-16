const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const context = canvas.getContext('2d');
const strip = document.querySelector('.strip'); // photo strip
const snap = document.querySelector('.snap'); // audio
let videoHeight = 0;
let videoWidth = 0;


function getVideo() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(localMediaStream => {
            video.srcObject = localMediaStream; // not the same from tutorial. oh well.
            video.play();
            videoWidth = localMediaStream.getVideoTracks()[0].getSettings().width;
            videoHeight = localMediaStream.getVideoTracks()[0].getSettings().height;
        })
        .catch(error => {
            console.error(`Oh no! webcam can't be accessed`, error);
        });        
}

function paintToCanvas() {
    canvas.width = videoWidth;
    canvas.height = videoHeight;

    return setInterval(() => {
        context.drawImage(video, 0, 0, videoWidth, videoHeight);
        let pixels = context.getImageData(0, 0, videoWidth, videoHeight);
        // pixels = redEffect(pixels);
        // pixels = rgbSplit(pixels); // cool technicolor splitting
        // context.globalAlpha = 0.1; // ghost effect
        pixels = greenScreen(pixels);
        context.putImageData(pixels, 0, 0);
    }, 16);
}

function takePhoto() {
    snap.currentTime = 0;
    snap.play();

    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome');
    link.textContent = 'Download Image';
    link.innerHTML = `<img src="${data}" alt="Handsome Man" />`;
    strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
    for(let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i + 0] -= 100;
        pixels.data[i + 1] -= 50;
        pixels.data[i + 2] *= 0.5;
    }
    return pixels;
}

function rgbSplit(pixels) {
    for(let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i - 150] = pixels.data[i + 0];
        pixels.data[i + 500] = pixels.data[i + 1];
        pixels.data[i - 550] = pixels.data[i + 2];
    }
    return pixels;
}

function greenScreen(pixels) {
    const levels = {};
    document.querySelectorAll('.rgb input').forEach((input) => {
        levels[input.name] = input.value;
    });

    for (i = 0; i < pixels.data.length; i += 4) {
        red = pixels.data[i + 0];
        green = pixels.data[i + 1];
        blue = pixels.data[i + 2];
        alpha = pixels.data[i + 3];

        if (red >= levels.rmin
            && green >= levels.gmin
            && blue >= levels.bmin
            && red <= levels.rmax
            && green <= levels.gmax
            && blue <= levels.bmax) {
                pixels.data[i + 3] = 0;
            }
    }
    return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas);