let videofeed;
let posenet;
let poses = [];
let started = false;
const audio = document.getElementById('audioElement');


// p5.js setup() function to set up the canvas for the web cam video stream
function setup() {
    //creating a canvas by giving the dimensions
    const canvas = createCanvas(500, 500);
    canvas.parent("video");

    videofeed = createCapture(VIDEO);
    videofeed.size(width, height);

    // setting up the poseNet model to feed in the video feed.
    posenet = ml5.poseNet(videofeed);

    posenet.on("pose", function (results) {
        poses = results;
    });

    videofeed.hide();
    noLoop();
}

// p5.js draw function() is called after the setup function
function draw() {
    if (started) {
        image(videofeed, 0, 0, width, height);
        calEyes();
    }
}


// toggle button for starting the video feed
function start() {
    select("#startstop").html("stop");
    document.getElementById("startstop").addEventListener("click", stop);
    started = true;
    loop();
}

// toggle button for ending the video feed
function stop() {
    select("#startstop").html('start')
    document.getElementById('startstop').addEventListener('click', start)
    removeBlur();
    started = false;
    noLoop();
}

// parameter for posenet to track the eyes
let rightEye,
    leftEye,
    defaultRightEyePosition = [],
    defaultLeftEyePosition = [];

// calculate position of various keypoints
function calEyes() {
    for(let i = 0; i < poses.length; i++){
        let pose = poses[i].pose;
        for(let j = 0; j < pose.keypoints.length; j++){
            let keypoint = pose.keypoints[j];
            rightEye = pose.keypoints[2].position;
            leftEye = pose.keypoints[1].position;

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

// Function to blur and play audio 
function blur() {
    document.body.style.filter = "blur(5px)";
    document.body.style.transition = "1s";
    let audio = document.getElementById("audioElement");
    audio.play();
}

// Function to remove blur and pause audio 
function removeBlur() {
    document.body.style.filter = "blur(0px)";
    let audio = document.getElementById("audioElement");
    audio.pause();
}

