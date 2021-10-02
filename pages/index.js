import Head from "next/head";
import { useEffect, useState } from "react";
import * as faceapi from "face-api.js";

export default function Home() {
  const [loadedModel, setLoadedModel] = useState(false);
  const [speedConst, setSpeedConst] = useState(1.0);
  const [complete, setComplete] = useState(true);
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

    let inputSize = 160;
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
          let currentX = Math.floor(fullDesc.box.x * 10) / 10;
          let currentY = Math.floor(fullDesc.box.y * 10) / 10;

          if (posX == -1) {
            posX = currentX;
          }

          if (posY == -1) {
            posY = currentY;
          }
          text.style.marginLeft = 0.7 * (posX - currentX) + "px";
          text.style.marginTop = 0.7 * (currentY - posY) + "px";

          console.log(
            `left : ${text.style.marginLeft} top: ${text.style.marginTop}`
          );
        }
        setComplete(true);
      }

      // console.log(`end : ${count}`);
      // count++;
    }, 10);
  }, []);

  const handleChange = (e) => {
    setSpeedConst(Number(e.target.value));
  };
  return (
    <div className="flex flex-col items-center min-h-screen py-2">
      <Head>
        <title>Wholdstill</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="text-center">
        <h1 className="text-8xl font-bold">Wholdstill</h1>
        <h1 className="text-3xl font-thin">whole + hold + still</h1>
        <input
          type="number"
          className="border-2 py-1"
          value={speedConst}
          onChange={handleChange}
        ></input>
        {loadedModel ? (
          <h2>Loaded! Model</h2>
        ) : (
          <h2 className="animate-pulse">Loading Model...</h2>
        )}
        {/* {complete ? <h1>Complete</h1> : <h1>Incomplete</h1>} */}
      </div>
      <div className=" overflow-hidden whitespace-nowrap border-2 h-48 w-96 flex justify-center items-center">
        <h1 id="myText" className="transition-all">
          {" "}
          Roses are red. Violets are blue. udv. uv vdu.
        </h1>
      </div>
      <div className=" overflow-hidden whitespace-nowrap border-2 h-48 w-96 flex justify-center items-center">
        <h1 className="transition-all">
          {" "}
          Roses are red. Violets are blue. udv. uv vdu.
        </h1>
      </div>
      <video crossorigin="anonymous" id="myVid" className="hidden" />
    </div>
  );
}
