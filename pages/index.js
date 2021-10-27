import Head from "next/head";
import { useEffect, useState } from "react";
import * as faceapi from "face-api.js";

export default function Home() {
  const [loadedModel, setLoadedModel] = useState(false);

  const [complete, setComplete] = useState(true);
  const [openSetting, setOpenSetting] = useState(false);
  const [speed, setSpeed] = useState(0.1);
  const toggleSetting = () => {
    setOpenSetting(!openSetting);
  };

  const handleSpeedChange = (e) => {
    setSpeed(e.target.value);
  };

  const getSpeed = () => {
    if (document.getElementById("speed"))
      return document.getElementById("speed").value;
    return 0.1;
  };
  const updateImg = () => {
    let files = document.getElementById("image-file").files;
    if (files && files[0]) {
      var img = document.getElementById("my-img");
      img.onload = () => {
        URL.revokeObjectURL(img.src); // no longer needed, free memory
      };
      img.src = URL.createObjectURL(files[0]); // set src to blob url
    }
  };
  useEffect(async () => {
    clearInterval();
    const video = document.getElementById("myVid");
    const text = document.getElementById("myText");

    if (
      "mediaDevices" in navigator &&
      "getUserMedia" in navigator.mediaDevices
    ) {
      video.setAttribute("playsinline", "");
      video.setAttribute("autoplay", "");
      video.setAttribute("muted", "");
      video.style.width = "100px";

      let facingMode = "user"; // Can be 'user' or 'environment' to access back or front camera (NEAT!)
      let constraints = {
        audio: false,
        video: {
          facingMode: facingMode,
        },
      };
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function success(stream) {
          video.srcObject = stream;
        });
    }

    const MODEL_URL = "/models";
    await faceapi.loadTinyFaceDetectorModel(MODEL_URL);

    setLoadedModel(true);
    // let count = 1;
    let movingAverage = 3;
    let couMovingAverage = 0;
    let posX = -1;
    let posY = -1;
    let oldPosX = -1;
    let oldPosY = -1;
    let averageX = 0.0;
    let averageY = 0.0;
    let posList = [];

    let inputSize = 96;
    let scoreThreshold = 0.4;
    const OPTION = new faceapi.TinyFaceDetectorOptions({
      inputSize,
      scoreThreshold,
    });

    setInterval(async () => {
      // tiny_face_detector options

      // console.log(`start : ${count}`);

      // detect all faces and generate full description from image
      // including landmark and descriptor of each face
      if (complete) {
        setComplete(false);
        let fullDesc = await faceapi.detectSingleFace(video, OPTION);
        // console.log(fullDesc);
        if (fullDesc != undefined) {
          let currentX = Math.floor(fullDesc.box.x * 20) / 20;
          let currentY = Math.floor(fullDesc.box.y * 20) / 20;
          if (couMovingAverage <= movingAverage) {
            averageX = averageX + currentX;
            averageY = averageY + currentY;
            posList.push({ x: currentX, y: currentY });
            couMovingAverage = couMovingAverage + 1;
          } else {
            averageX = averageX - posList[0].x;
            averageY = averageY - posList[0].y;
            posList.shift();

            averageX = averageX + currentX;
            averageY = averageY + currentY;
            posList.push({ x: currentX, y: currentY });
          }
          console.log(currentX, averageX);

          if (posX == -1) {
            posX = currentX;
          }

          if (posY == -1) {
            posY = currentY;
          }

          let speedConst = getSpeed();

          text.style.marginLeft =
            speedConst * (posX - averageX / movingAverage) + "px";
          text.style.marginTop =
            speedConst * (averageY / movingAverage - posY) + "px";
          // if (
          //   Math.abs(currentX - oldPosX) < 1 ||
          //   Math.abs(currentY - oldPosY) < 1
          // ) {
          // } else {
          //   text.style.marginLeft = speedConst * (posX - currentX) + "px";
          //   text.style.marginTop = speedConst * (currentY - posY) + "px";
          // }
          oldPosX = currentX;
          oldPosY = currentY;

          // console.log(speedConst);
        }
        setComplete(true);
      }

      // console.log(`end : ${count}`);
      // count++;
    }, 25);
  }, []);

  return (
    <div className="flex flex-col items-center justify-start pt-2 ">
      <Head>
        <title>Wholdstill</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="text-center mb-10 flex flex-col justify-start">
        <h1 className="text-7xl font-bold">Wholdstill</h1>
        <h1 className="text-3xl font-thin">whole + hold + still</h1>
        <button
          className="bg-blue-400 rounded-md px-2 py-1 shadow-lg my-2"
          onClick={toggleSetting}
        >
          Setting
        </button>

        <div>
          <input id="image-file" type="file" />
          <button
            className="bg-blue-400 rounded-md px-2 py-1 shadow-lg "
            onClick={updateImg}
          >
            update
          </button>
        </div>
      </div>
      {openSetting ? (
        <div className="flex flex-col pb-10">
          <label HtmlFor="speed">Speed </label>
          <input
            id="speed"
            type="number"
            step={0.1}
            onChange={handleSpeedChange}
            value={speed}
          />
        </div>
      ) : (
        <></>
      )}

      <div
        style={{ "transition-duration": 500 }}
        className=" transition-all w-full overflow-hidden"
      >
        <div id="myText" className="overflow-hidden flex justify-center w-full">
          {loadedModel ? (
            <>
              <img
                id="my-img"
                src="instruction.jpeg"
                className="w-screen md:w-5/6"
                height="auto"
                width="100%"
              ></img>
              {/* <iframe src="quiz.pdf" width="400px" height="400px"></iframe> */}
            </>
          ) : (
            <h2 className="animate-pulse">Loading Model...</h2>
          )}
        </div>
      </div>

      <video crossOrigin="anonymous" id="myVid" className="hidden" />
    </div>
  );
}
