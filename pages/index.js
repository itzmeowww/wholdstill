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
    let posX = -1;
    let posY = -1;

    let inputSize = 96;
    let scoreThreshold = 0.3;
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

          if (posX == -1) {
            posX = currentX;
          }

          if (posY == -1) {
            posY = currentY;
          }

          let speedConst = getSpeed();
          // console.log(speedConst);
          text.style.marginLeft = speedConst * (posX - currentX) + "px";
          text.style.marginTop = speedConst * (currentY - posY) + "px";
        }
        setComplete(true);
      }

      // console.log(`end : ${count}`);
      // count++;
    }, 25);
  }, []);

  return (
    <div
      className="flex flex-col items-center  py-2 bg-green-100"
      style={{ height: "150vh" }}
    >
      <Head>
        <title>Wholdstill</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="text-center mb-10">
        <h1 className="text-7xl font-bold">Wholdstill</h1>
        <h1 className="text-3xl font-thin">whole + hold + still</h1>
        <button
          className="bg-gray-200 rounded-md px-2  py-1 shadow-md "
          onClick={toggleSetting}
        >
          Setting
        </button>
      </div>
      {openSetting ? (
        <div className="flex flex-col pb-10">
          <label for="speed">Speed : {speed}</label>
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

      <div style={{ "transition-duration": 100 }} className=" transition-all">
        <div id="myText" className="bg-gray-200 rounded-xl p-4">
          {loadedModel ? (
            <iframe src="quiz.pdf" width="400px" height="400px"></iframe>
          ) : (
            <h2 className="animate-pulse">Loading Model...</h2>
          )}
        </div>
      </div>

      <video crossOrigin="anonymous" id="myVid" className="hidden" />
    </div>
  );
}
