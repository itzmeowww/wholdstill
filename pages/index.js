import Head from "next/head";
import { useEffect, useState } from "react";
import * as faceapi from "face-api.js";

export default function Home() {
  const [leftEyePos, setLeftEyePos] = useState(0);
  const [posX, setPosX] = useState(0);
  const [loadedModel, setLoadedModel] = useState(false);
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
      video.style.width = "200px";
      video.style.height = "200px";

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

    await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
    await faceapi.loadFaceLandmarkModel(MODEL_URL);
    await faceapi.loadFaceRecognitionModel(MODEL_URL);

    setLoadedModel(true);

    setInterval(async () => {
      let faceDetection = await faceapi
        .detectSingleFace(video)
        .withFaceLandmarks();

      if (faceDetection != undefined) {
        let currentNosePos = Math.floor(faceDetection.landmarks.getNose()[0].x);
        console.log(currentNosePos);

        text.style.marginRight = currentNosePos - 400 + "px";

        // console.log(currentLeftEyePos);
        // if (leftEyePos == 0) {
        //   setLeftEyePos(currentLeftEyePos);
        // } else {
        //   let leftEyePosDif = currentLeftEyePos - leftEyePos;
        //   setLeftEyePos(currentLeftEyePos);
        //   setPosX(posX + leftEyePosDif);
        //   text.style.marginLeft = posX + "px";
        // }
      }
    }, 1000);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Wholdstill</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">Wholdstill</h1>
        <h1 className="text-3xl font-thin mt-4">whole + hold + still</h1>
      </main>
      {loadedModel ? <h2>Loaded Model</h2> : <h2>Loading Model</h2>}
      <h1 id="myText" className="transition-all">
        {" "}
        DEMO TEXT DEMO TEXT
      </h1>
      <video crossorigin="anonymous" id="myVid" />
    </div>
  );
}
