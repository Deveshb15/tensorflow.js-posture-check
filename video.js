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

    console.log(poses);
    videofeed.hide();
    noLoop();
}

// p5.js draw function
function draw() {
    if(started){
        image(videofeed, 0, 0, width, height);
        calcEyes();
    }
}


// toggle for start and stop
function start() {
    select("#startstop").html('stop')
    document.getElementById('startstop').addEventListener('click', stop)
    started = true;
    loop();
}

// toggle for start and stop
function stop() {
    started = false;
    select("#startstop").html('start')
    document.getElementById('startstop').addEventListener('click', start)
    noLoop();
}

// parameter for posenet to track the eyes
let rightEye,
    leftEye,
    defaultRightEyePosition = [],
    defaultLeftEyePosition = []

// calculate position of various keypoints
function calcEyes() {
    for(let i = 0; i < poses.length; i++){
        let pose = poses[i].pose;
        for(let j = 0; j < pose.keypoints.length; j++){
            let keypoint = pose.keypoints[j];
            rightEye = pose.keypoints[j].position;
            leftEye = pose.keypoints[j].position;

            // keypoints are the points representing the different joints on the body recognized by posenet
            while(defaultRightEyePosition < 1) {
                defaultRightEyePosition.push(rightEye.y)
            }

            while(defaultLeftEyePosition < 1) {
                defaultLeftEyePosition.push(leftEye.y)
            }

            // if the current position of the body is too far from the original position blur function is called
            if(Math.abs(rightEye.y - defaultRightEyePosition[0]) > 20){
                blur();
            }
            if(Math.abs(rightEye.y - defaultRightEyePosition[0]) < 20){
                removeBlur();
            }
        }
    }
}