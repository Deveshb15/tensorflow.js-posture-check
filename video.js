let videofeed;
let posenet;
let started = false;
let poses = [];
const audio = document.getElementById('audioElement');


// p5.js setup
function setup() {

    let canvas = createCanvas(500,500);
    canvas.parent('video');

    videofeed = createCapture(VIDEO);
    videofeed.size(width, height);

    posenet = ml5.poseNET(videofeed);
    posenet.on('pose', function (results) {
        poses = results;
    });

    videofeed.hide();
    noLoop();
}

