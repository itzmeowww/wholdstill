import Head from "next/head";
import { useEffect, useState } from "react";
import * as faceapi from "face-api.js";

export default function Home() {
  const [loadedModel, setLoadedModel] = useState(false);
  const [speedConst, setSpeedConst] = useState(1);
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
    await faceapi.loadTinyFaceDetectorModel(MODEL_URL);

    setLoadedModel(true);
    let count = 1;
    let posX = -1;
    setInterval(async () => {
      // tiny_face_detector options
      console.log(`start : ${count}`);
      let inputSize = 512;
      let scoreThreshold = 0.3;
      const OPTION = new faceapi.TinyFaceDetectorOptions({
        inputSize,
        scoreThreshold,
      });

      // detect all faces and generate full description from image
      // including landmark and descriptor of each face
      let fullDesc = await faceapi.detectSingleFace(video, OPTION);
      // console.log(fullDesc);

      if (fullDesc != undefined) {
        let currentX = fullDesc.box.x;
        if (posX == -1) {
          posX = currentX;
        }
        text.style.marginLeft = speedConst * (posX - currentX) + "px";
      }
      console.log(`end : ${count}`);
      count++;
    }, 300);
  }, []);

  const handleChange = (e) => {
    setSpeedConst(Number(e.target.value));
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Wholdstill</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">Wholdstill</h1>
        <h1 className="text-3xl font-thin mt-4">whole + hold + still</h1>
        {speedConst}
        <input type="number" value={speedConst} onChange={handleChange}></input>
      </main>
      {loadedModel ? <h2>Loaded Model</h2> : <h2>Loading Model</h2>}
      <div className="w-screen max-w-full overflow-hidden flex flex-row justify-center">
        <h1 id="myText" className="transition-all absolute">
          {" "}
          DEMO TEXT DEMO TEXT
        </h1>
      </div>
      <video crossorigin="anonymous" id="myVid" />
    </div>
  );
}
